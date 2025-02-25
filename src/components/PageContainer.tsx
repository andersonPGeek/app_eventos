import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return <div className="min-h-screen bg-gray-100 pb-16">{children}</div>;
};

export default PageContainer;
