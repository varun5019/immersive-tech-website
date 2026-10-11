import { createFileRoute,Link } from '@tanstack/react-router';
import { useEffect,useState } from 'react';
import { labHead } from '@/lib/lab/meta';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
export const Route=createFileRoute('/reset-password')({head:()=>labHead('Reset password','Set a new password for your Immersive Technologies Lab account.'),component:Reset});
function Reset(){const [valid,setValid]=useState(false);const [password,setPassword]=useState('');const [done,setDone]=useState(false);useEffect(()=>{if(window.location.hash.includes('type=recovery'))setValid(true);supabase.auth.getUser().then(({data})=>{if(data.user)setValid(true);});},[]);return <div className="page-wrap content-page max-w-md mx-auto"><h1 className="page-title text-4xl">Reset your password.</h1>{done?<><p className="body-copy">Your password has been updated.</p><Button asChild className="mt-6"><Link to="/editstuff">Back to sign-in</Link></Button></>:valid?<form className="editor-form" onSubmit={async e=>{e.preventDefault();const {error}=await supabase.auth.updateUser({password});if(error)toast.error(error.message);else setDone(true);}}><label className="form-field">New password<Input type="password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)}/></label><Button>Set new password</Button></form>:<p className="body-copy">Open the password reset link from your email to continue.</p>}</div>;}
