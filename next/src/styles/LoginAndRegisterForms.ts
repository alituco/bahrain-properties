import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
} 
from "@mui/material";
import { styled } from "@mui/system";
  
  // Styled components
  export const StyledContainer = styled(Container)(({  }) => ({
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }));
  
  export const FormCard = styled(Box)(({  }) => ({
    padding: 4,
    boxShadow: '3',
    borderRadius: '3',
    backgroundColor: 'white',
    width: "100%",
  }));
  
  export const StyledHeading = styled(Typography)(({  }) => ({
    fontSize: "2rem",
    textAlign: "center",
    fontWeight: 600,
    marginBottom: 2,
  }));
  
  export const StyledTextField = styled(TextField)(({  }) => ({
    marginBottom: 10,
  }));
  
  export const StyledButton = styled(Button)(({  }) => ({
    marginTop: 2,
  }));
  
  export const ErrorMessage = styled(Typography)(({  }) => ({
    color: 'red',
    textAlign: "center",
    marginTop: 1,
  }));


  const LoginAndRegisterForms = {
    StyledContainer,
    FormCard,
    StyledHeading,
    StyledTextField,
    StyledButton,
    ErrorMessage,
  };

  export default LoginAndRegisterForms;