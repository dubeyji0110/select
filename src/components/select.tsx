"use client";
import { ChangeEvent, FormEvent, KeyboardEvent, useState } from "react";
import { User } from "@/data";
import { Images } from "@/assests";
import Image from "next/image";

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
    } else if (filteredUsers.length > 0) {
      if (e.key === "ArrowDown") {
        const nextIndex = (highlighted + 1) % filteredUsers.length;
        document.getElementById(`${nextIndex}`)?.scrollIntoView({
          behavior: "smooth",
        });
        setHighlighted(nextIndex);
      } else if (e.key === "ArrowUp") {
        let nextIndex = (highlighted - 1) % filteredUsers.length;
        if (nextIndex < 0) nextIndex = filteredUsers.length - 1;
        document.getElementById(`${nextIndex}`)?.scrollIntoView({
          behavior: "smooth",
        });
        setHighlighted(nextIndex);
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
    <div className="border border-white rounded-md p-2 flex relative w-full items-center">
      <div className="mr-1 flex flex-wrap items-center">
        {selectedUsers.map((user) => (
          <div
            key={user.value.id}
            className="shadow-sm outline outline-2 outline-[#e63946] m-1 h-min bg-[#457b9d]  flex items-center p-0 leading-none rounded-2xl overflow-hidden"
          >
            <Image
              // @ts-ignore
              src={Images[user.value.image]}
              alt="profile image"
              className="rounded-full w-8 h-8 ml-1"
            />
            <p className="flex-1 pl-2 pr-1 font-medium">{user.label}</p>
            <span
              className=" cursor-pointer p-1 inline-block h-full"
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
            className="focus-visible:border-0 focus-visible:outline-0 w-full bg-transparent "
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
          />
          <button type="submit" className="hidden" />
        </form>
        {filteredUsers.length > 0 && (
          <div className="absolute top-[110%] left-0 w-full shadow-md z-20 rounded-lg overflow-auto max-h-[250px]">
            <ul className="bg-[#244256]">
              {filteredUsers.map((user, index) => (
                <li
                  className={`hover:bg-[#457b9d] px-4 py-2 cursor-pointer ${
                    highlighted === index && "bg-[#457b9d]"
                  }`}
                  key={user.value.id}
                  id={`${index}`}
                  onClick={() => handleEnterUser(user)}
                >
                  <div className="flex items-center">
                    <div>
                      <Image
                        // @ts-ignore
                        src={Images[user.value.image]}
                        width={100}
                        height={100}
                        alt="profile image"
                        className="rounded-full h-8 w-8 mr-2"
                      />
                    </div>
                    <div>
                      <p>{user.label}</p>
                      <p className="text-sm text-slate-300">
                        {user.value.email}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {selectedUsers.length > 0 && (
        <div
          className="cursor-pointer text-lg "
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
