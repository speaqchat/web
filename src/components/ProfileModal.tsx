import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import ProfilePicture from "../assets/img/profile_pic.png";
import PictureIcon from "../assets/icon/image.svg";
import { useStore } from "../store/useStore";
import { Friend } from "../types";
import axios from "axios";
import LoaderIcon from "../assets/icon/loader.svg";
import ProgressBar from "./ProgressBar";

const UserModal = ({
  user,
  onClick,
}: {
  user: Friend;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [progress, setProgress] = useState(0);

  const queryClient = useQueryClient();

  const onClickPicture = async () => {
    if (!inputRef.current) return;
    inputRef.current.click();

    const file = inputRef.current.files?.[0];
    if (!file) return;

    await mutateAsync(file);

    queryClient.invalidateQueries(["profilePicture", user.id]);
  };

  const { mutateAsync, isLoading } = useMutation(
    "picture",
    async (picture: File) => {
      if (!picture.type.includes("image")) return;

      const formData = new FormData();
      formData.append("picture", picture);

      const res = await axios.post(`/picture/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      return res.data;
    },
    {
      onSuccess: () => {
        setProgress(0);
        queryClient.invalidateQueries(["profilePicture", user.id]);
      },
    }
  );

  const { data: profilePicture, isLoading: isLoadingPicture } = useQuery(
    ["profilePicture", user.id],
    async () => {
      const response = await fetch(
        `https://speaq-api.herokuapp.com/picture/${user.id}`
      );

      if (response.headers.get("Content-Type")?.includes("application/json"))
        return null;

      const imgBlob = await response.blob();

      return URL.createObjectURL(imgBlob);
    }
  );

  const { auth } = useStore();

  const me = user.id === auth?.user.id;

  return (
    <div
      onClick={onClick}
      className="z-20 w-screen h-screen absolute top-0 bg-primary-dark backdrop-filter backdrop-blur-md bg-opacity-25 flex items-center justify-center"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ translateY: 60, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        exit={{ translateY: -60, opacity: 0 }}
        className="dark:bg-secondary-dark bg-primary-light dark:text-white gap-2 flex flex-col px-6 py-6 rounded shadow"
      >
        <h1 className="font-bold">{me ? "Your profile" : "Profile"}</h1>
        <div className="bg-tertiary-dark w-96 h-px"></div>
        <div className="flex items-center gap-4 mt-2">
          <div
            className={
              isLoadingPicture || isLoading
                ? "animate-pulse relative"
                : "relative"
            }
          >
            <img
              className={"object-fill rounded-full h-16 w-16"}
              src={profilePicture ? profilePicture : ProfilePicture}
              alt=""
            />
            {me && (
              <>
                <button
                  onClick={() => {
                    onClickPicture();
                  }}
                  className="absolute bg-secondary-dark p-0.5 -bottom-0.5 -right-0.5 rounded w-6 h-6 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <img className="invert" src={PictureIcon} alt="" />
                </button>
                <input
                  onChange={(e) => {
                    if (!e.target.files) return;
                    const file = e.target.files[0];
                    mutateAsync(file);
                  }}
                  type="file"
                  id="file"
                  ref={inputRef}
                  style={{ display: "none" }}
                />
              </>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="leading-none font-bold">{user.username}</h2>
            <p className="leading-none text-xs text-tertiary-dark">
              {"Joined " +
                new Date(user.createdAt).toLocaleDateString("en-gb", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {isLoading && (
            <div className="mt-2">
              <ProgressBar progress={progress} />
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default UserModal;
