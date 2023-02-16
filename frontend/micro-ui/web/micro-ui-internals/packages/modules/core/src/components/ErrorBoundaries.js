import React from "react";
import ErrorComponent from "./ErrorComponent";

const Redircter = () => {
  const path = Digit.UserService.getType() === "employee" ? "/digit-ui/employee/user/error" : "/digit-ui/citizen/error";
  if (
    window.location.href.includes("employee/user/error") ||
    window.location.href.includes("citizen/error") ||
    process.env.NODE_ENV === "development"
  ) {
    //do nothing
  }else{
    window.location.href = path;
  }
  return <span></span>;
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorStack: null, hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error: error?.message, hasError: true, errorStack: error?.stack };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({ error: error?.message, hasError: true, errorStack: error?.stack });
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      // ("UI-errorInfo", this.state?.errorStack);
      // ("UI-component-details", this.props);
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <Redircter />
          <ErrorComponent initData={this.props.initData} />

          {/* <summary>Something went wrong</summary>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state?.errorStack && this.state.errorStack.toString().substring(0, 600)}
            {this.state?.error}
          </details> */}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
