const Sidebar = () => {
  const users = ["Alice", "Bob", "Charlie"]; // Example list of users
  return (
    <div className="w-1/4 bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <ul>
        {users.map((user) => (
          <li
            key={user}
            className="p-2 hover:bg-gray-200 rounded cursor-pointer"
          >
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
