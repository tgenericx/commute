import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { LoginDocument, type LoginMutation, type LoginMutationVariables } from '../graphql/graphql';
import { useAuth } from '@/contexts/AuthContext';
import { apolloClient } from '@/lib/apolloClient';

const Login = () => {
  const navigate = useNavigate();
  const { handleAuthError } = useAuth();
  const [login, { loading }] = useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await login({
        variables: { userData: form },
      });
      window.alert(data)

      if (data?.login?.accessToken) {
        localStorage.setItem('accessToken', data.login.accessToken);
        if (data.login.refreshToken) {
          localStorage.setItem('refreshToken', data.login.refreshToken);
        }

        await apolloClient.clearStore();
        navigate('/');
      } else {
        window.alert('Invalid credentials');
      }

    } catch (error: any) {
      handleAuthError(error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>
      <h1>Welcome Back</h1>
      <p>Log in to your account</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
