import React from "react";
import { Link } from "@gravity-ui/uikit";

const Footer: React.FC = () => {
  return (
    <footer className='p-4 mt-auto'>
      <div className='container mx-auto text-center'>
        <Link href='https://vself.app/terms' target='_blank'>
          T&C vSelf {new Date().getFullYear()}
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
