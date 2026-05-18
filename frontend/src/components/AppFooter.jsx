function AppFooter({ className = '' }) {
  const footerClassName = ['app-footer', className].filter(Boolean).join(' ');

  return (
    <footer className={footerClassName}>
      <div className="container">
        <small>
          &copy; 2025-26 <strong>TREVO</strong> | Roll No: <strong>24071A05F1</strong> | Name:{' '}
          <strong>Sai Likith</strong>. All rights reserved.
        </small>
      </div>
    </footer>
  );
}

export default AppFooter;
