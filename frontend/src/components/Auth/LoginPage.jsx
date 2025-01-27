import React, { useState } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';

export default function SignInPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uname: username,
                    password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Login successful!');
                console.log(data); // Optional: Check the user data in console
                // Redirect to home or dashboard page
                window.location.href = '/home';
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Invalid username or password!');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="app_bg flexcenter app_wrapper">
            <div className="auth__box">
                <h2 className="headtext__cormorant">Sign In</h2>
                <form className="form__container" onSubmit={handleLogin}>
                    {error && <p className="error__message">{error}</p>}
                    <p>
                        <label className="p__cormorant">Username or Email Address</label>
                        <br />
                        <input
                            type="text"
                            name="username"
                            className="custom__input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </p>
                    <p>
                        <label className="p__cormorant">Password</label>
                        <a href="/forget-password" className="p_opensans right_link">
                            Forget password?
                        </a>
                        <br />
                        <input
                            type="password"
                            name="password"
                            className="custom__input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </p>
                    <p>
                        <button id="sub_btn" type="submit" className="custom__button">
                            Login
                        </button>
                    </p>
                </form>
                <footer className="p__opensans">
                    <p>
                        First time? <Link to="/register" className="p__cormorant">Create an account</Link>.
                    </p>
                    <p>
                        <a href="/" className="p__cormorant">Back to Homepage</a>.
                    </p>
                </footer>
            </div>
        </div>
    );
}