import Nav from "./nav";

const Layout = ({ children }) => {
  return (
    <div>
      <Nav />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
