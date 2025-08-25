const Layout = ({ children }) => {
  return (
    <div className="mx-auto w-full max-w-4xl grow p-4 sm:p-6 lg:p-8">
      {children}
    </div>
  );
};

export default Layout;
