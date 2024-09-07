// import React, { Component } from 'react';

// class ErrorBoundary extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError() {
//     // Update state to render fallback UI on error
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     // Log error to an error reporting service
//     console.error("ErrorBoundary caught an error:", error);
//     console.error("Error details:", errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div style={{ textAlign: 'center', padding: '20px' }}>
//           <h1>Something went wrong.</h1>
//           <p>We are experiencing technical difficulties. Please try again later.</p>
//         </div>
//       );
//     }

//     return this.props.children; 
//   }
// }

// export default ErrorBoundary;


// ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
