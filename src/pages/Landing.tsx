import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <>
      <div >
        <Link to="/login">
          <button >Sign In</button>
        </Link>
      </div>
      <div >
        <span>Built by students, for students</span>
      </div>
      <h1 >
        Campus life shouldn't be scattered
      </h1>
      <p >
        A central hub where students can easily discover, manage, and connect around events
        happening on and off campus. Because you deserve better than a dozen WhatsApp groups.
      </p>
    </>
  );
};

export default Landing;
