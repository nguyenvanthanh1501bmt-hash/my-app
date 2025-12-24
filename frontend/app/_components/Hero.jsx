import React from "react";
import Image from "next/image";
import {ContainerScroll} from "@/components/ui/components/ui/container-scroll-animation.tsx";
import dashboard from "./dashboard.png";

function Hero() {
    return (
        <section className="bg-gray-50 flex items-center flex-col pt-10">
            <div className="flex flex-col overflow-hidden w-full justify-center items-center">
                <ContainerScroll
                    titleComponent={
                        <div className="-mt-100">   
                            <h1 className="text-5xl font-semibold text-black dark:text-white mb-3 text-center">
                                Expense Management Application
                            </h1>

                            <p className="text-gray-600 dark:text-gray-300 text-lg mt-0 mb-10">
                                Smart financial tracking for your daily expenses.
                            </p>
                        </div>
                    }
                >

                    <Image
                    src={dashboard} 
                    alt="Dashboard Preview" 
                    height={720} 
                    width={1400} 
                    className="mx-auto rounded-2xl object-contain h-full object-center" 
                    draggable={false}
                    />
                </ContainerScroll>
            </div>
        </section>
    )
}

export default Hero;