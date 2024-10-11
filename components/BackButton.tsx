import { Button, Icon } from "@gravity-ui/uikit";
import { ArrowLeft } from "@gravity-ui/icons";
import React from "react";

export type BackButtonProps = {
  onClick: () => void;
};

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <div className='absolute top-4 left-12 z-100'>
      <Button onClick={onClick}>
        <Icon data={ArrowLeft} />
      </Button>
    </div>
  );
};

export default BackButton;
