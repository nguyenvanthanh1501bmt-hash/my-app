import React from "react";
import Image from "next/image";
import {ContainerScroll} from "@/components/ui/components/ui/container-scroll-animation.tsx";

function Hero() {
    return (
        <section className="bg-gray-50 flex items-center flex-col">
            <div className="flex flex-col overflow-hidden">
                <ContainerScroll
                    titleComponent={
                    <>
                        <h1 className="text-4xl font-semibold text-black dark:text-white">
                        Test app mới nha bà con <br />
                        <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none mb-1">
                            Thử xem nó chạy không mà thấy cái next.js này mạnh vkl
                        </span>
                        </h1>
                    </>
                    }
                >
                    <Image
                    src={`/LogoWeb-removebg-preview.png`}
                    alt="hero"
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