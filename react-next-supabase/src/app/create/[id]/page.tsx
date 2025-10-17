"use client";

import { Progress } from "@/components/ui/progress";
import styles from "./page.module.scss";
import { Button } from "@/components/ui/button";
import LabelCalendar from "@/components/common/calender/LabelCalendar";
import Image from "next/image";
import BasicBoard from "@/components/common/board/BasicBoard";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";
import { nanoid } from "nanoid";

interface Todo {
    id: number;
    title: string;
    start_date: string | Date;
    end_date: string | Date;
    contents: BoardContent[];
}

interface BoardContent {
    boardId: string | number;
    isCompleted: boolean;
    title: string;
    startDate: string | Date;
    endDate: string | Date;
    content: string;
}

function page() {
    const router = useRouter();
    const pathname = usePathname();

    const [boards, setBoards] = useState<Todo>();
    const [startDate, setStartDate] = useState<string | Date | undefined>(
        new Date()
    );
    const [endDate, setEndDate] = useState<string | Date | undefined>(
        new Date()
    );

    const inserRowData = async (contents: BoardContent[]) => {
        if (boards?.contents) {
            const { data, error, status } = await supabase
                .from("todos")
                .update({
                    contents: contents,
                })
                .eq("id", pathname.split("/")[2])
                .select();

            if (error) {
                console.log(error);
                toast("에러가 발생했습니다.", {
                    description: "콘솔 창에 출력된 에러를 확인하세요.",
                });
            }

            if (status === 200) {
                toast("추가완료", {
                    description: "새로운 보드가 추가되었습니다.",
                });
                getData();
            }
        } else {
            const { data, error, status } = await supabase
                .from("todos")
                .insert({
                    contents: contents,
                })
                .eq("id", pathname.split("/")[2])
                .select();

            if (error) {
                console.log(error);
                toast("에러가 발생했습니다.", {
                    description: "콘솔 창에 출력된 에러를 확인하세요.",
                });
            }

            if (status === 201) {
                toast("생성완료", {
                    description: "새로운 보드가 생성되었습니다.",
                });
                getData();
            }
        }
    };

    const createBoard = () => {
        let newContents: BoardContent[] = [];
        const BoardContent = {
            boardId: nanoid(),
            isCompleted: false,
            title: "",
            startDate: "",
            endDate: "",
            content: "",
        };

        if (boards && boards.contents.length > 0) {
            newContents = [...boards.contents];
            newContents.push(BoardContent);
            inserRowData(newContents);
        } else if (boards && boards.contents.length === 0) {
            newContents.push(BoardContent);
            inserRowData(newContents);
        }
    };

    const getData = async () => {
        let {
            data: todos,
            error,
            status,
        } = await supabase.from("todos").select("*");

        if (todos !== null) {
            todos.forEach((item: Todo) => {
                if (item.id === Number(pathname.split("/")[2])) {
                    setBoards(item);
                }
            });
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.container__header}>
                <div className={styles.container__header__contents}>
                    <input
                        type="text"
                        placeholder="Enter Title Here"
                        className={styles.input}
                    />
                    <div className={styles.progressBar}>
                        <span className={styles.progressBar__status}>
                            0/10 completed
                        </span>
                        <Progress
                            value={33}
                            className="w-[30%] h-2"
                            indicatorColor="bg-green-500"
                        />
                    </div>
                    <div className={styles.calendarBox}>
                        <div className={styles.calendarBox__calendar}>
                            <LabelCalendar label="From" />
                            <LabelCalendar label="To" />
                        </div>
                        <Button
                            variant={"outline"}
                            className="w-[15%] border-orange-500 bg-orange-400 text-white hover:bg-orange-400 hover:text-white"
                            onClick={createBoard}
                        >
                            Add New Board
                        </Button>
                    </div>
                </div>
            </header>
            <main className={styles.container__body}>
                {boards?.contents.length === 0 ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={styles.container__body__infoBox}>
                            <span className={styles.title}>
                                There is no board yet.
                            </span>
                            <span className={styles.subTitle}>
                                Click the button and start flashing!
                            </span>
                            <button className={styles.button}>
                                <Image
                                    src="/assets/images/round-button.png"
                                    alt="round-button"
                                    width={100}
                                    height={100}
                                />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-start w-full h-full gap-4">
                        {boards?.contents.map((board: BoardContent) => {
                            return <BasicBoard key={board.boardId} />;
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default page;
