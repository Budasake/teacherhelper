
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UserRole = "student" | "teacher" | "administrator";

type User = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
};

export default function UserManagement({
  users: initialUsers,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedRoles, setSelectedRoles] = useState<
    Record<string, UserRole>
  >({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();

  async function updateRole(userId: string) {
    const selectedRole = selectedRoles[userId];

    if (!selectedRole) return;

    setUpdatingId(userId);
    setMessage("");
    setError("");

    const { error: updateError } = await supabase.rpc(
      "admin_update_user_role",
      {
        target_user_id: userId,
        new_role: selectedRole,
      }
    );

    if (updateError) {
      setError(updateError.message);
      setUpdatingId(null);
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? { ...user, role: selectedRole }
          : user
      )
    );

    setMessage("User role updated successfully.");
    setUpdatingId(null);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Registered Users
        </h2>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
          {users.length} users
        </span>
      </div>

      {message && (
        <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-5 py-4 font-semibold">User</th>
              <th className="px-5 py-4 font-semibold">Role</th>
              <th className="px-5 py-4 font-semibold">Joined</th>
              <th className="px-5 py-4 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {users.map((user) => {
              const selectedRole =
                selectedRoles[user.id] ?? user.role;

              const isCurrentUser = user.id === currentUserId;

              return (
                <tr key={user.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">
                      {user.full_name || "Unnamed user"}
                    </p>
                    <p className="mt-1 text-gray-500">
                      {user.email}
                    </p>
                    {isCurrentUser && (
                      <span className="mt-1 inline-block text-xs text-indigo-600">
                        Your account
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={selectedRole}
                      disabled={isCurrentUser || updatingId === user.id}
                      onChange={(event) =>
                        setSelectedRoles((current) => ({
                          ...current,
                          [user.id]: event.target.value as UserRole,
                        }))
                      }
                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 disabled:bg-gray-100"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="administrator">Administrator</option>
                    </select>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    {isCurrentUser ? (
                      <span className="text-xs text-gray-400">
                        Protected
                      </span>
                    ) : (
                      <button
                        onClick={() => updateRole(user.id)}
                        disabled={
                          selectedRole === user.role ||
                          updatingId === user.id
                        }
                        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                      >
                        {updatingId === user.id ? "Saving..." : "Save"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  No registered users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
