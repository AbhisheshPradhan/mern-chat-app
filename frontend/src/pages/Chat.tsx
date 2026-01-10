import { useState } from 'react';
import { Header } from '../components/Header';
import { UserList } from '../components/UserList';
import { ChatRoom } from '../components/ChatRoom';

export const Chat = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <UserList
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
        />
        {selectedUserId ? (
          <ChatRoom selectedUserId={selectedUserId} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                Select a conversation
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Choose a user from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
