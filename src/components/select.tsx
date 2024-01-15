"use client";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  LegacyRef,
  Ref,
  useEffect,
  useRef,
  useState,
} from "react";
import { User } from "@/data";

interface Option {
  label: string;
  value: User;
}

interface Props {
  placeholder?: string;
  options: Option[];
}

function Select({ options, placeholder }: Props) {
  const [selectedUsers, setSelectedUsers] = useState<Option[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setInputValue(e.target.value);
    if (e.target.value.length > 0) {
      setFilteredUsers(
        options
          .filter((x) =>
            x.label.toLowerCase().includes(e.target.value.toLowerCase())
          )
          .filter(
            (x) => !selectedUsers.map((y) => y.value.id).includes(x.value.id)
          )
      );
    } else setFilteredUsers([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue.length == 0) {
      setSelectedUsers((prev) => prev.slice(0, -1));
    }
    if (filteredUsers.length > 0) {
      if (e.key === "ArrowDown") {
        setHighlighted((prev) => (prev + 1) % filteredUsers.length);
      } else if (e.key === "ArrowUp") {
        setHighlighted((prev) => (prev - 1) % filteredUsers.length);
      }
    }
  };

  const handleEnterUser = (user: Option) => {
    setFilteredUsers([]);
    setSelectedUsers((prev) => [...prev, user]);
    setInputValue("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (filteredUsers.length > 0) {
      const user = filteredUsers.find((x, index) => index === highlighted);
      if (user) {
        setSelectedUsers((prev) => [...prev, user]);
      }
    }
    setInputValue("");
    setHighlighted(0);
    setFilteredUsers([]);
  };

  return (
    <div className="border border-black rounded-md p-2 flex relative w-full items-center">
      <div className="mr-1 flex space-x-1 space-y-1 flex-wrap items-center">
        {selectedUsers.map((user) => (
          <div
            key={user.value.id}
            className="shadow-sm outline outline-1 outline-[#afafaf] h-min bg-white flex items-center p-0 leading-none rounded-2xl overflow-hidden"
          >
            <p className="text-xs flex-1 pl-2">{user.label}</p>
            <span
              className="text-slate-800 hover:bg-red-500 hover:text-white cursor-pointer p-1"
              onClick={() => {
                setSelectedUsers((prev) =>
                  prev.filter((x) => x.value.id !== user.value.id)
                );
              }}
            >
              &times;
            </span>
          </div>
        ))}
      </div>
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="w-full min-w-24">
          <input
            className="focus-visible:border-0 focus-visible:outline-0 w-full"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              setFilteredUsers(
                options
                  .filter((x) =>
                    x.label.toLowerCase().includes(inputValue.toLowerCase())
                  )
                  .filter(
                    (x) =>
                      !selectedUsers.map((y) => y.value.id).includes(x.value.id)
                  )
              )
            }
            onBlurCapture={(e) => {
              setTimeout(() => {
                // setFilteredUsers([]);
              }, 200);
            }}
          />
          <button type="submit" className="hidden" />
        </form>
        {filteredUsers.length > 0 && (
          <div className="absolute top-full left-0 w-full shadow-md z-20 rounded-sm">
            <ul className="bg-white">
              {filteredUsers.map((user, index) => (
                <li
                  className={`hover:bg-[#f2f2f2] px-4 py-2 cursor-pointer ${
                    highlighted === index && "bg-[#f2f2f2]"
                  }`}
                  key={user.value.id}
                  onClick={() => handleEnterUser(user)}
                >
                  {user.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {selectedUsers.length > 0 && (
        <div
          className="cursor-pointer"
          onClick={() => {
            setInputValue("");
            setFilteredUsers([]);
            setSelectedUsers([]);
            setHighlighted(0);
          }}
        >
          <span>&times;</span>
        </div>
      )}
    </div>
  );
}

export default Select;
