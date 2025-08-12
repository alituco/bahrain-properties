import { RequestHandler } from 'express';
import jwt    from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import path  from 'path';
import admin from 'firebase-admin';

import { pool }              from '../config/db';
import { config }            from '../config/env';
import { bucket }            from '../config/firebase';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

const mailgun = new Mailgun(FormData);
const mg      = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
  url: process.env.MAILGUN_API_URL || undefined,
});

/* helpers */
function generateOTP(len = 6) {
  const d = '0123456789';
  return Array.from({ length: len }, () => d[(Math.random() * d.length) | 0]).join('');
}

async function sendMail(opts: Parameters<typeof mg.messages.create>[1]) {
  await mg.messages.create(process.env.MAILGUN_DOMAIN!, opts);
}

/* =================================================================
   GET /user/me
================================================================= */
export const getProfile: RequestHandler = async (req, res) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) {
      res.status(401).json({ success:false, message:'Not authenticated' });
      return;
    }

    const decoded: any = jwt.verify(token, config.jwtSecret);
    const { rows } = await pool.query(
      `SELECT u.user_id,
              u.first_name,
              u.last_name,
              u.email,
              u.phone_number,             -- ▲ include phone
              u.real_estate_firm,
              u.role,
              u.firm_id,
              CASE WHEN u.role = 'admin' THEN f.login_code ELSE NULL END AS firm_registration_code,
              f.logo_url AS firm_logo_url
         FROM users u
         JOIN firms f ON f.firm_id = u.firm_id
        WHERE u.user_id = $1`,
      [decoded.user_id]
    );
    if (!rows.length) {
      res.status(404).json({ success:false, message:'User not found' });
      return;
    }

    res.json({ success:true, user: rows[0] });
  } catch (e) {
    console.error('Error in getProfile:', e);
    res.status(500).json({ success:false, message:'Server error' });
  }
};

/* =================================================================
   PUT /user/phone
   body: { phone_number: string }
================================================================= */
export const updatePhoneNumber: RequestHandler = async (req, res) => {
  try {
    const { user } = req as AuthenticatedRequest;
    if (!user) {
      res.status(401).json({ success:false, message:'Not authenticated' });
      return;
    }

    const { phone_number } = req.body as { phone_number?: string };
    if (typeof phone_number !== 'string' || !phone_number.trim()) {
      res.status(400).json({ success:false, message:'Phone number required' });
      return;
    }

    // allow +, digits, spaces, dashes, parentheses
    const cleaned = phone_number.trim();
    const okFormat = /^[+\d][\d\s\-()]{5,}$/.test(cleaned);
    if (!okFormat) {
      res.status(400).json({ success:false, message:'Invalid phone format' });
      return;
    }

    const q = await pool.query(
      `UPDATE users
          SET phone_number = $1
        WHERE user_id = $2
        RETURNING user_id, phone_number`,
      [cleaned, user.user_id]
    );

    if (!q.rowCount) {
      res.status(404).json({ success:false, message:'User not found' });
      return;
    }

    res.json({ success:true, phone_number: q.rows[0].phone_number });
  } catch (e) {
    console.error('Error updating phone number:', e);
    res.status(500).json({ success:false, message:'Server error' });
  }
};

/* =================================================================
   PUT /firms/:firmId/registration-code
================================================================= */
export const updateFirmRegistrationCode: RequestHandler = async (req, res) => {
  const { user } = req as AuthenticatedRequest;
  if (user!.role !== 'admin') {
    res.status(403).json({ success:false, message:'Forbidden' });
    return;
  }

  const { new_code } = req.body;
  if (!new_code) {
    res.status(400).json({ success:false, message:'Code required' });
    return;
  }

  try {
    const { rows } = await pool.query(
      `UPDATE firms
          SET login_code = $1
        WHERE firm_id = $2
        RETURNING login_code`,
      [new_code, user!.firm_id]
    );
    res.json({ success:true, code:rows[0].login_code });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success:false, message:'Server error' });
  }
};

/* =================================================================
   PUT /firms/:firmId/logo   (admin only, multipart/form-data)
================================================================= */
export const updateFirmLogo: RequestHandler = async (req, res) => {
  try {
    const { user } = req as AuthenticatedRequest;
    if (user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, message: 'Logo file required' });
      return;
    }

    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const destPath = `firm_logos/${user!.firm_id}${fileExt}`;
    const fileRef = bucket.file(destPath);

    await fileRef.save(req.file.buffer, {
      contentType: req.file.mimetype,
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destPath}`;

    await pool.query(
      `UPDATE firms SET logo_url = $1 WHERE firm_id = $2`,
      [publicUrl, user!.firm_id]
    );

    await admin.firestore()
      .collection('firm_logos')
      .doc(String(user!.firm_id))
      .set({
        logo_url: publicUrl,
        updated_at: new Date(),
      });

    res.json({ success: true, logo_url: publicUrl });
  } catch (err) {
    console.error('Error updating firm logo:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* =================================================================
   GET /firms/:firmId/users
================================================================= */
export const getUsersByFirm: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req as AuthenticatedRequest;
    const firmName = user!.real_estate_firm;

    const { rows } = await pool.query(
      `SELECT user_id, first_name, last_name, email, role
         FROM users
        WHERE real_estate_firm = $1
        ORDER BY last_name, first_name`,
      [firmName]
    );
    res.json({ users: rows });
  } catch (err) { next(err); }
};

/* =================================================================
   DELETE /users/:userId
================================================================= */
export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const adminUser = (req as AuthenticatedRequest).user!;
    if (adminUser.role !== 'admin') {
      res.status(403).json({ message:'Forbidden' });
      return;
    }

    const { userId } = req.params;
    const { rows } = await pool.query(
      `DELETE FROM users
         WHERE user_id = $1 AND firm_id = $2
         RETURNING user_id, email`,
      [userId, adminUser.firm_id]
    );
    if (!rows.length) {
      res.status(404).json({ message:'User not found' });
      return;
    }

    res.json({ message:'User deleted', user:rows[0] });
  } catch (err) { next(err); }
};

/* =================================================================
   POST /user/email-change/request
================================================================= */
export const requestEmailChange: RequestHandler = async (req, res) => {
  const { new_email } = req.body;
  const { user } = req as AuthenticatedRequest;

  if (!new_email) {
    res.status(400).json({ success:false, message:'New e-mail required' });
    return;
  }

  try {
    const dup = await pool.query(`SELECT 1 FROM users WHERE email=$1`, [new_email]);
    if (dup.rowCount) {
      res.status(400).json({ success:false, message:'E-mail already in use' });
      return;
    }

    const otp = generateOTP();
    await pool.query(
      `INSERT INTO email_change_requests
        (user_id, new_email, otp, expires_at)
       VALUES ($1,$2,$3,NOW()+INTERVAL '15 min')
       ON CONFLICT (new_email) WHERE used=FALSE
       DO UPDATE SET otp=EXCLUDED.otp, expires_at=NOW()+INTERVAL '15 min', used=FALSE`,
      [user!.user_id, new_email, otp]
    );

    await sendMail({
      from: `"Manzil" <${process.env.MAILGUN_FROM}>`,
      to: new_email,
      subject: 'Confirm your new e-mail',
      text: `Your OTP is ${otp}`,
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 15 min.</p>`,
    });

    res.json({ success:true, message:'OTP sent' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success:false, message:'Server error' });
  }
};

/* =================================================================
   POST /user/email-change/verify
================================================================= */
export const verifyEmailChangeOTP: RequestHandler = async (req, res) => {
  const { otp, new_email } = req.body;
  const { user } = req as AuthenticatedRequest;
  if (!otp || !new_email) {
    res.status(400).json({ success:false, message:'OTP & e-mail required' });
    return;
  }

  try {
    const chk = await pool.query(
      `UPDATE email_change_requests
          SET used=TRUE
        WHERE user_id=$1 AND new_email=$2 AND otp=$3
          AND used=FALSE AND expires_at>NOW()
        RETURNING id`,
      [user!.user_id, new_email, otp]
    );
    if (!chk.rowCount) {
      res.status(400).json({ success:false, message:'OTP invalid/expired' });
      return;
    }

    await pool.query(`UPDATE users SET email=$1 WHERE user_id=$2`, [new_email, user!.user_id]);
    res.json({ success:true, message:'E-mail updated' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success:false, message:'Server error' });
  }
};

/* =================================================================
   POST /user/change-password
================================================================= */
export const changePassword: RequestHandler = async (req, res) => {
  const { current_password, new_password } = req.body;
  const { user } = req as AuthenticatedRequest;

  try {
    const u = await pool.query(`SELECT password FROM users WHERE user_id=$1`, [user!.user_id]);
    if (!u.rowCount || !(await bcrypt.compare(current_password, u.rows[0].password))) {
      res.status(400).json({ success:false, message:'Current password wrong' });
      return;
    }

    const hash = await bcrypt.hash(new_password, 10);
    await pool.query(`UPDATE users SET password=$1 WHERE user_id=$2`, [hash, user!.user_id]);
    res.json({ success:true, message:'Password changed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success:false, message:'Server error' });
  }
};
