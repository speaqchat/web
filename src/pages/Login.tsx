import axios from "axios";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";

import { z, ZodError } from "zod";

const Login = () => {
  const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().regex(PASSWORD_REGEX),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login: storeLogin } = useStore();

  const navigate = useNavigate();

  const loginMutation = useMutation(() => {
    return axios.post("/login", {
      email,
      password,
    });
  });

  const login = async () => {
    try {
      loginSchema.parse({
        email,
        password,
      });
      const res = await loginMutation.mutateAsync();
      storeLogin(res.data);
      navigate("/");
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div>
      <form
        className="flex flex-col gap-4 container mx-auto px-96 mt-12"
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
      >
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="text"
          className="border border-tertiary-light focus:outline-none rounded shadow"
        />
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          className="border border-tertiary-light focus:outline-none rounded shadow"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
