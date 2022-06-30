import axios from "axios";
import { useState } from "react";
import { isError, useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import LoginImage from "../assets/img/login_screenshot.png";
import BgGradient from "../assets/img/bg_gradient.webp";
import LoaderIcon from "../assets/icon/loader.svg";
import { AnimatePresence, motion } from "framer-motion";

import { z } from "zod";

const Login = () => {
  const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().regex(PASSWORD_REGEX),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { login: storeLogin } = useStore();

  const navigate = useNavigate();

  const loginMutation = useMutation(
    async () => {
      const res = await axios.post("/login", {
        email,
        password,
      });
      return res.data;
    },
    {
      onMutate: () => {
        setLoading(true);
      },
      onSuccess: (result) => {
        storeLogin(result);
        navigate("/");
      },
      onError: () => {
        setLoading(false);
        setError(true);
        setTimeout(() => setError(false), 5000);
      },
    }
  );

  const login = async () => {
    try {
      loginSchema.parse({
        email,
        password,
      });
      loginMutation.mutate();
    } catch (err: any) {
      setError(true);
      setTimeout(() => setError(false), 5000);
      // console.log(err);
    }
  };

  return (
    <div className="flex justify-between h-screen overflow-hidden">
      <div className="h-screen w-1/2 overflow-hidden flex flex-col justify-between">
        <svg
          viewBox="0 0 88 89"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 ml-10 mt-10"
        >
          <path
            d="M83.9999 42.2778C84.0152 48.1439 82.6446 53.9306 79.9999 59.1667C76.864 65.4411 72.0432 70.7186 66.0774 74.4079C60.1117 78.0973 53.2366 80.0528 46.2222 80.0556C40.3561 80.0709 34.5694 78.7003 29.3333 76.0556L4 84.5L12.4444 59.1667C9.79968 53.9306 8.42914 48.1439 8.44444 42.2778C8.44715 35.2634 10.4027 28.3883 14.0921 22.4225C17.7814 16.4568 23.0589 11.636 29.3333 8.50012C34.5694 5.85537 40.3561 4.48483 46.2222 4.50013H48.4444C57.7081 5.0112 66.4579 8.92128 73.0183 15.4817C79.5787 22.0421 83.4888 30.7919 83.9999 40.0556V42.2778Z"
            stroke="#141414"
            stroke-width="7.77777"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M64.9195 34.9436C64.1079 24.4541 54.2885 21.8521 45.6052 21.8521C37.6522 21.8521 26.8589 24.7793 26.8589 34.4557C26.8589 44.4573 37.3276 44.714 46.0109 45.2019C52.6654 45.4459 55.2623 47.7911 55.1 49.824C54.9377 52.1008 51.4481 53.727 46.0109 53.727C41.0606 53.727 36.4349 52.7513 36.1915 48.8482L26.1285 48.6856C26.7778 58.8498 35.7045 62.1837 45.7675 62.1837C55.0189 62.1837 64.7572 58.5245 65.8933 50.6371C66.6237 39.6598 56.155 38.4401 47.1471 37.7895C41.9533 37.4643 37.2464 36.9764 37.2464 34.3744C37.2464 31.4471 41.2229 30.2274 45.6863 30.2274C48.1209 30.2274 54.3696 30.7153 55.1812 35.2688L64.9195 34.9436Z"
            fill="#141414"
          />
        </svg>
        <div className="w-7/12 self-end pr-20 flex flex-col gap-2">
          <h2 className="font-bold text-3xl tracking-normal pr-20 lg:text-4xl leading-[0.95]">
            Your new chat client.
          </h2>
          <p className="tracking-tight text-sm lg:text-normal leading-[1.1]">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Consectetur, expedita harum. Natus ab repellat explicabo doloribus
            corporis placeat animi illum!
          </p>
        </div>
        <img className="w-7/12 self-end" src={LoginImage} alt="" />
        <img
          className="-z-10 h-screen absolute top-0 w-[100vw]"
          src={BgGradient}
          alt=""
        />
      </div>
      <div className="h-screen w-1/2 bg-primary-dark border-l-4 border-l-secondary-dark flex items-center justify-center text-white">
        <div className="font-medium w-3/5">
          <h3 className="text-2xl mb-6">Login</h3>

          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
          >
            <label className="mb-2" htmlFor="email">
              Email address
            </label>
            <input
              placeholder="name@email.com"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="text"
              className="focus:outline-none px-3 mb-4 h-10 rounded-lg bg-secondary-dark border border-white border-opacity-10 focus:border-opacity-50 transition-[border] ease-in-out"
            />
            <label className="mb-2" htmlFor="password">
              Password
            </label>
            <input
              placeholder="your password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              className="focus:outline-none px-3 mb-8 h-10 rounded-lg bg-secondary-dark border border-white border-opacity-10 focus:border-opacity-50 transition-[border] ease-in-out"
            />
            <button
              className="focus:outline-none focus:border-2 flex items-center justify-center mb-4 h-10 hover:opacity-80 transition-opacity bg-brand-blue rounded-lg font-medium"
              type="submit"
            >
              {loading ? (
                <img src={LoaderIcon} className="animate-spin-cool" />
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>
          <p className="font-normal text-sm">
            Don't have an account?{" "}
            <a
              href="https://speaq.site/register"
              className="text-brand-blue focus:underline cursor-pointer hover:opacity-80 hover:underline transition-opacity focus:outline-none"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
      <AnimatePresence>
        {error ? (
          <motion.div
            onClick={() => setError(false)}
            initial={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0 }}
            transition={{ bounce: false }}
            className="absolute cursor-pointer hover:opacity-80 transition-opacity bottom-6 right-6 bg-red-700 px-4 py-2 rounded-lg shadow text-white"
          >
            Incorrect credentials
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Login;
