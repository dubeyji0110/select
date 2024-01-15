import Select from "@/components/select";
import { users } from "@/data";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center md:p-24 p-4">
      <div className="absolute top-60 left-1/2 -translate-x-1/2 w-full md:m-28 m-8">
        <ul className="list-disc">
          <li>Type of search users</li>
          <li>Use up/down arrow to naivgate through the list</li>
        </ul>
      </div>
      <Select
        options={users.map((user) => ({ label: user.name, value: user }))}
        placeholder="Select..."
      />
    </main>
  );
}
