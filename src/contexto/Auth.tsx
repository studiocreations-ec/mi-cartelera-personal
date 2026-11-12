import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import type { User } from '@supabase/supabase-js';
import { esDemo, supabase } from '../servicios/cliente';
type AuthState={user:User|null;pending:boolean;demo:boolean};
const Context=createContext<AuthState>({user:null,pending:true,demo:false});
const demoUser={id:'demo-local',email:'demo@local.test'} as User;
export function AuthProvider({children}:PropsWithChildren){
  const [user,setUser]=useState<User|null>(esDemo?demoUser:null);
  const [pending,setPending]=useState(!esDemo);
  useEffect(()=>{
    if(!supabase)return;
    let activo=true;
    void supabase.auth.getUser().then(({data})=>{if(activo){setUser(data.user);setPending(false);}}).catch(()=>{if(activo)setPending(false);});
    const {data:subscription}=supabase.auth.onAuthStateChange((_event,session)=>{setUser(session?.user??null);setPending(false);});
    return ()=>{activo=false;subscription.subscription.unsubscribe();};
  },[]);
  return <Context.Provider value={{user,pending,demo:esDemo}}>{children}</Context.Provider>;
}
export function useAuth(){return useContext(Context);}
