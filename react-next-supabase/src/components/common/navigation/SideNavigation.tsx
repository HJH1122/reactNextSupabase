"use client";

import { Button } from "@/components/ui/button";
import styles from "./SideNavigation.module.scss";
import { Dot, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import { useEffect, useState } from "react";

function SideNavigation() {
    const router = useRouter();
    const [todos, setTodos] = useState<any>([]);

    const onCreate = async () => {
        console.log("함수 호출");

        const { error, status } = await supabase.from("todos").insert([
            {
                title: "",
                start_date: "",
                end_date: "",
                contents: [],
            },
        ]);

        if (error) {
            console.log(error);
        }

        if (status === 201) {
            toast("페이지 생성 완료", {
                description: "새로운 투두리스트가 생성되었습니다.",
            });
            router.push("create");
        }
    };

    const getTodos = async () => {
        let {
            data: todos,
            error,
            status,
        } = await supabase.from("todos").select("*");

        if (status === 200) {
            setTodos(todos);
        }
    };

    useEffect(() => {
        getTodos();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.container__searchBox}>
                <Input
                    type="text"
                    placeholder="검색어를 입력해주세요."
                    className="focus-visible:ring-0"
                />
                <Button variant={"outline"} size={"icon"}>
                    <Search className="w-4 h-4" />
                </Button>
            </div>
            <div className={styles.container__buttonBox}>
                <Button
                    variant={"outline"}
                    className="w-full text-orange-500 border-orange-400 hover:bg-orange-50 hover:text-orange-500"
                    onClick={onCreate}
                >
                    Add New Page
                </Button>
            </div>
            <div className={styles.container__todos}>
                <span className={styles.container__todos__label}>
                    Your To Do
                </span>
                <div className={styles.container__todos__list}>
                    {todos &&
                        todos.map((item: any) => {
                            return (
                                <div
                                    className="flex items-center py-2 bg-[#f5f5f4] rounded-sm cursor-pointer"
                                    key={item.id}
                                >
                                    <Dot className="mr-1 text-green-400"></Dot>
                                    <span className="text-sm">
                                        {item.title === ""
                                            ? "제목 없음"
                                            : item.title}
                                    </span>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}

export default SideNavigation;
