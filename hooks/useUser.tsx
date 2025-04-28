import { Subscription, UserDetails } from "@/types";

import { User } from "@supabase/auth-helpers-nextjs";

import {
    useSessionContext,
    useUser as useSupaUser
} from "@supabase/auth-helpers-react";

import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
    subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [propName: string]: any;
};

export const MyUserContextProvider = (props: Props) => {
    const {
        session,
        isLoading: isLoadingUser,
        supabaseClient: supabase
    } = useSessionContext();

    const user = useSupaUser();

    const accessToken = session?.access_token ?? null;

    const [isLoading, setIsLoading] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [subscriptionDetails, setSubscriptionDetails] = useState<Subscription | null>(null);

    const getUserDetails = async () => {
        return await supabase.from('users').select('*').single();
    }

    const getSubscription = async () => {
        return await supabase
            .from('subscriptions')
            .select('*, prices(*,products(*))')
            .in('status', ['trialing', 'active'])
            .single();
    }

    useEffect(() => {
        const fetchData = async () => {

            if (user && !isLoading && !userDetails && !subscriptionDetails) {
                setIsLoading(true);

                const userDetails = await getUserDetails();
                const subscriptionDetails = await getSubscription();

                if (userDetails) {
                    setUserDetails(userDetails.data);
                }
                else {
                    console.log("Problem with accquiring user details");
                }

                if (subscriptionDetails) {
                    setSubscriptionDetails(subscriptionDetails.data);
                }
                else {
                    console.log("Problem with accquiring user subscription");
                }

                setIsLoading(false);
            }
            else if (!user && !isLoadingUser && !isLoading) {
                setUserDetails(null);
                setSubscriptionDetails(null);
            }
        }

        fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isLoadingUser]);

    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoading,
        subscription: subscriptionDetails
    };

    return <UserContext.Provider value={value} {...props} />
};

export const useUser = () => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error('useUser must be used within a MyUserContextProvider');
    }

    return context;
};