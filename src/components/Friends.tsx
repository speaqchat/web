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
      params: {
        userId: auth?.user.id,
      },
    });

    return res.data;
  };

  const {
    data: friends,
    isLoading,
    error,
  } = useQuery("friends", fetchFriends, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 1,
  });

  const Display = () => {
    if (isLoading)
      return (
        <div className="flex-grow flex items-center justify-center">
          <img src={LoaderIcon} className="animate-spin-cool" />
        </div>
      );

    if (error)
      return (
        <div className="w-full flex-1 flex items-center justify-center">
          <h1 className="text-red-600 text-lg">Error loading friends.</h1>
        </div>
      );

    if (!friends) return <div>error friends</div>;

    if (!friends[0])
      return (
        <div className="w-full flex-1 flex items-center justify-center">
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-lg">You haven't added any friends!</h1>

            <button className="bg-secondary-dark px-4 py-1 rounded shadow hover:opacity-80 transition-opacity">
              Add
            </button>
          </div>
        </div>
      );

    return (
      <div className="flex flex-col mt-6 gap-4">
        {friends.map((friend) => (
          <FriendItem key={friend.id} user={friend} />
        ))}
      </div>
    );
  };

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
        <Display />
        {/* {error && <div>error fetching friends</div>} */}
      </div>
    </>
  );
};

export default Friends;
