import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../auth/auth-provider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export function LoginForm({ className, ...props }) {
  const { handleLogin } = useAuth();

  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const login = async (e) => {
    e.preventDefault();
    setLoading(true)
    setErr('')

    try {
      const creds = {
        username: e.target.elements.username.value,
        password: e.target.elements.password.value,
      };

      const role = await handleLogin(creds);

      if(role === 'teacher'){
        navigate('/')
      }else{
        navigate('/profile')
      }

    } catch (error) {
        setErr(error?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  };

  return (
    <form
      onSubmit={login}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your username below to get started!
        </p>
      </div>
      <div className="grid gap-6">
        {err && <Label className="bg-red-500 p-2 -mb-4 text-white rounded">{err}</Label>}
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="username" required />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          {loading ? 'Loggin in' : 'Login'}
        </Button>
      </div>
    </form>
  );
}
