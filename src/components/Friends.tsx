import axios from "axios";
import { useQuery } from "react-query";
import LoaderIcon from "../assets/icon/loader.svg";
import FriendIcon from "../assets/icon/user-plus.svg";
import { useStore } from "../store/useStore";
import { Friend } from "../types";
import FriendItem from "./Friend";

const Friends = () => {
  const { auth } = useStore();

  const fetchFriends = async (): Promise<Friend[]> => {
    const res = await axios.get("/friends", {
      data: {
        user_id: auth?.user?.id,
      },
    });

    return res.data;
  };

  const {
    data: friends,
    isLoading,
    error,
  } = useQuery(["friends"], fetchFriends, {
    refetchOnWindowFocus: true,
    keepPreviousData: false,
  });

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="h-24 flex items-center justify-between pr-6">
          <h1 className="font-medium text-2xl ml-6">Friends</h1>
          <div className="rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center bg-secondary-light h-7 w-7 dark:bg-secondary-dark text-center leading-none">
            <img className="dark:invert" src={FriendIcon} alt="" />
          </div>
        </div>
        <div className="bg-tertiary-dark h-px mx-6" />
        {isLoading && !error ? (
          <div className="flex-grow flex items-center justify-center">
            <img src={LoaderIcon} className="animate-spin-cool" />
          </div>
        ) : friends && friends[0] ? (
          <div className="flex flex-col mt-6 gap-4">
            {friends.map((friend) => (
              <FriendItem key={friend.id} user={friend} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 flex-grow items-center justify-center">
            <p>Seems like you haven't added any friends!</p>
            <button className="px-2 py-1 bg-secondary-light dark:bg-secondary-dark shadow rounded">
              Add a friend
            </button>
          </div>
        )}
        {/* {error && <div>error fetching friends</div>} */}
      </div>
    </>
  );
};

export default Friends;
