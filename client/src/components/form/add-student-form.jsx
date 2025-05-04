import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

function AddStudent({ setStudents, setOpenDialog }) {
  const [adding, setAdding] = useState(false);

  const AddStudent = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const studentData = {
      firstName: formData.get("firstName"),
      middleName: formData.get("middleName"),
      lastName: formData.get("lastName"),
      suffix: formData.get("suffix"),
      gender: formData.get("gender"),
      birthday: formData.get("birthday"),
      address: formData.get("address"),
      guardian: formData.get("guardian"),
      guardianContact: formData.get("guardianContact"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      setAdding(true);
      const res = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}api/auth/register`,
        studentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 200) {
        setStudents((prev) => [res.data, ...prev]);
        toast.success("Student added successfully");
        e.target.reset();
        setOpenDialog(false);
      } else {
        toast.error("Failed to add student", {
          description: "Please try again later.",
        });
      }
    } catch (error) {
      toast.error("Failed to add student", {
        description: "Please try again later.",
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <form onSubmit={AddStudent} className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label>First Name</Label>
          <Input className="border border-violet-300" name="firstName" />
        </div>
        <div className="space-y-1">
          <Label>Middle Name</Label>
          <Input className="border border-violet-300" name="middleName" />
        </div>
        <div className="space-y-1">
          <Label>Last Name</Label>
          <Input className="border border-violet-300" name="lastName" />
        </div>
        <div className="space-y-1">
          <Label>Suffix</Label>
          <Input className="border border-violet-300" name="suffix" />
        </div>
        <div className="space-y-1">
          <Label>Gender</Label>
          <Select name="gender">
            <SelectTrigger className="w-full border border-violet-300">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Birthdate</Label>
          <Input
            type="date"
            className="border border-violet-300"
            name="birthday"
          />
        </div>
        <div className="space-y-1 col-span-2">
          <Label>Address</Label>
          <Input className="border border-violet-300" name="address" />
        </div>
        <div className="space-y-1">
          <Label>Guardian</Label>
          <Input className="border border-violet-300" name="guardian" />
        </div>
        <div className="space-y-1">
          <Label>Guardian Contact</Label>
          <Input type="number" className="border border-violet-300" name="guardianContact" />
        </div>
        <div className="space-y-1">
          <Label>Username</Label>
          <Input className="border border-violet-300" name="username" />
        </div>
        <div className="space-y-1">
          <Label>Password</Label>
          <Input type="password" className="border border-violet-300" name="password" />
        </div>
        <div className="col-span-full flex justify-end mt-2">
          <Button
            type="submit"
            disabled={adding}
            className={`${adding && "animate-pulse"}`}
          >
            {adding ? "Adding Student" : "Add Student"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default AddStudent;
