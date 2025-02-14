"use client"
import { useQuery } from "@tanstack/react-query";
import { SugCard } from "../cards/sugCard";
import { getUserData } from "@/lib/actions/user.action";

const RightSidebar =  () => {
    let {data:userInfo,isLoading} = useQuery({
      queryKey:['userData'],
      queryFn:()=>getUserData(),
    })




  return (
    <section className="rightsidebar custom-scrollbar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className=" text-heading4-medium text-light-1 mb-6">
          Suggested Users
        </h3>
        

          <SugCard
          result={[]}
            userInfo={userInfo}
            type={"communities"}
          />
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className=" text-heading4-medium text-light-1 mb-6">Suggested Users</h3>
         
          <SugCard result={[]}  userInfo={userInfo} type={"users"} />
      </div>
    </section>
  );
};

export default RightSidebar;