import React, { useContext, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../App";
import ParticlesComponent2 from "../components/Particles2";
import { toast } from "react-hot-toast";

const Login = () => {
  const { setCurrentUsername } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    if (!user.email || !user.password) {
      toast.error("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.msg || "Invalid credentials or server error.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!data.userName) {
        toast.error("Login failed: missing username in response.");
        setLoading(false);
        return;
      }

      const username = data.userName;
      setCurrentUsername(username);
      localStorage.setItem("currentusername", username);
      toast.success("Login successful!");

      // Fetch profile data
      try {
        const profileResponse = await fetch(`http://localhost:8000/home/${username}`);

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log("Profile data:", profileData);
          navigate(`/${username}/home`);
        } else if (profileResponse.status === 404) {
          toast("Profile not found. Redirecting to edit profile...", { icon: "ℹ️" });
          navigate(`/${username}/edit-profile`);
        } else {
          toast("Unable to fetch profile. Redirecting to edit profile...", { icon: "⚠️" });
          navigate(`/${username}/edit-profile`);
        }
      } catch (profileError) {
        console.error("Error during profile fetch:", profileError);
        toast.error("Error checking profile. Redirecting...");
        navigate(`/${username}/edit-profile`);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    navigate("/"); // Adjust if signup route is different
  };

  return (
    <div className="login">
      <ParticlesComponent2 className="particles-js" />
      <div className="login-container">
        <h2>Login</h2>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="text"
          name="email"
          value={user.email}
          onChange={handleChange}
          className="login-input"
          autoComplete="email"
          disabled={loading}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          className="login-input"
          autoComplete="current-password"
          disabled={loading}
        />

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="not-member">
          <h3>Not a member?</h3>
          <button className="signup-button" onClick={handleSignup} disabled={loading}>
            Signup now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
