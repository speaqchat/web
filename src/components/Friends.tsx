import axios from "axios";
import { useQuery } from "react-query";
import LoaderIcon from "../assets/icon/loader.svg";
import FriendIcon from "../assets/icon/user-plus.svg";
import { useStore } from "../store/useStore";
import { Friend } from "../types";
import FriendItem from "./Friend";
import FriendRequest from "./FriendRequest";

const Friends = ({
  openModal,
  onAddConversation,
}: {
  openModal: () => void;
  onAddConversation: () => void;
}) => {
  const { auth } = useStore();

  const fetchFriendReq = async (): Promise<any> => {
    const res = await axios.get("/friendreqs", {
      params: {
        userId: auth?.user.id,
      },
    });

    return res.data;
  };

  const {
    data: friendReq,
    isLoading: isLoadingFriendReq,
    isError: isErrorFriendReq,
  } = useQuery("friendreq", fetchFriendReq, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    retry: 1,
  });

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
    isLoading: isLoadingFriends,
    isError: isErrorFriends,
  } = useQuery("friends", fetchFriends, {
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    retry: 1,
  });

  const DisplayFriendReq = () => {
    if (isLoadingFriendReq) return null;
    if (!friendReq) return null;

    if (isErrorFriendReq)
      return (
        <div className="w-full flex-1 flex items-center justify-center">
          <h1 className="text-red-600 text-lg">Error loading friends.</h1>
        </div>
      );

    if (!friendReq.incoming[0] && !friendReq.outgoing[0]) return null;

    return (
      <div className="flex flex-col mt-6 gap-4">
        {friendReq.incoming[0] ? (
          <>
            <p className="ml-6 uppercase text-sm font-bold opacity-90">
              Incoming friend requests
            </p>
            {friendReq.incoming.map((fr: any) => (
              <FriendRequest type="incoming" key={fr.id} user={fr.user} />
            ))}
            <hr className="opacity-40 mx-6 mt-2" />
          </>
        ) : null}
        {friendReq.outgoing[0] ? (
          <>
            <p className="ml-6 uppercase text-sm font-bold opacity-90">
              Outgoing friend requests
            </p>
            {friendReq.outgoing.map((fr: any) => (
              <FriendRequest type="outgoing" key={fr.id} user={fr.friend} />
            ))}
            <hr className="opacity-40 mx-6 mt-2" />
          </>
        ) : null}
      </div>
    );
  };

  const DisplayFriends = () => {
    if (isLoadingFriends)
      return (
        <div className="flex-grow flex items-center justify-center">
          <img src={LoaderIcon} className="animate-spin-cool" />
        </div>
      );

    if (isErrorFriends)
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

            <button
              onClick={() => openModal()}
              className="bg-secondary-dark px-4 py-1 rounded shadow hover:opacity-80 transition-opacity"
            >
              Add
            </button>
          </div>
        </div>
      );

    return (
      <div className="flex flex-col mt-6 gap-4">
        {friends.map((friend) => (
          <FriendItem
            onAddConversation={onAddConversation}
            key={friend.id}
            user={friend}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="h-24 flex items-center justify-between pr-6">
          <h1 className="font-medium text-2xl ml-6">Friends</h1>
          <div
            onClick={openModal}
            className="rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center bg-secondary-light h-7 w-7 dark:bg-secondary-dark text-center leading-none"
          >
            <img className="dark:invert" src={FriendIcon} alt="" />
          </div>
        </div>
        <div className="bg-tertiary-dark h-px mx-6" />
        <DisplayFriendReq />
        <DisplayFriends />
        {/* {error && <div>error fetching friends</div>} */}
      </div>
    </>
  );
};

export default Friends;
