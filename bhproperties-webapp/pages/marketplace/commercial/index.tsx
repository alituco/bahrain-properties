'use client'

import { PageWithLayout } from "@/types/PageWithLayout";

const Commercial: PageWithLayout = () => {
    return (
        <h1 className='d-flex justify-content-center' style={{ marginTop: '5rem' }}>
            Commercial Marketplace (Coming soon)
        </h1>
    )
}

Commercial.layout = 'BlankLayout';
export default Commercial;