"use client";
import React, { useEffect, useRef, useState,useContext } from "react";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import {
  ConfigProvider,
  DatePicker,
  DatePickerProps,
  Input,
  InputRef,
  Select, 
  Tag,
  theme,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Editor from "@/components/Texteditor/Editor";
import Button from "@/components/utils/Button";
import { NearContext } from "@/wallets/near";
import { BugBountyContract } from "@/config";
import dayjs, { Dayjs } from "dayjs"
import {BountyAccount, BountyStatus, BountyType, MilestonesType} from "@/redux/types"
import { ulid } from 'ulid';
import {  ulidToDate } from "@/utils/TimeStamp";

interface bountyT {
  title:string,
  startDate: number,
  endDate:number,
  creator: string,
  status:BountyStatus,
  bounty_type: BountyType,
  noOfWinners: number,
  tokenForReward: string,
  prize:number,
}

const CreateBounty = () => {
  const { token } = theme.useToken();
  const [tags, setTags] = useState(["Tag 1", "Tag 2"]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [bountyDetails, setBountyDetails] = useState<string>("");
  const inputRef = useRef<InputRef>(null);
  const [loading, setLoading] = useState(false)
  const [bounty, setBounty] = useState<bountyT>({
    title:"",
    startDate: Date.now(),
    endDate:Date.now(),
    creator: "",
    status:BountyStatus.AcceptingHunters,
    bounty_type: BountyType.OpenSource,
    noOfWinners: 0,
    tokenForReward: "",
    prize:0,

  })
  const {wallet, signedAccountId} = useContext(NearContext)


  const handleClearFields = () => {
    setBountyDetails("")
    setBounty({
        title:"",
        startDate: Date.now(),
        endDate:Date.now(),
        creator: "",
        status:BountyStatus.AcceptingHunters,
        bounty_type: BountyType.OpenSource,
        noOfWinners: 0,
        tokenForReward: "",
        prize:0,
    
      })
    
  }
  //  TAG FUNCTIONS
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const forMap = (tag: string) => (
    <span key={tag} style={{ display: "inline-block" }}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <Tag
          closable
          onClose={(e) => {
            e.preventDefault();
            handleClose(tag);
          }}
        >
          {tag}
        </Tag>
      </ConfigProvider>
    </span>
  );

  const tagChild = tags.map(forMap);

  const tagPlusStyle: React.CSSProperties = {
    borderStyle: "dashed",
  };

  // Details

  const handleContent = (rules: any) => {
    setBountyDetails(rules);
  };

  const onChangeDate: DatePickerProps<Dayjs>['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };
  const createBounty = async() => {
    try {
      setLoading(true)
      const data  = {
        id_hash:ulid(),
        creator: bounty.creator,
        creator_id: null,
        status: bounty.status,
        idx: 1,
        starting_date: bounty.startDate.toString(),
        bounty_rules: bountyDetails,
        bounty_type: bounty.bounty_type,
        milestone: "",
        guild:[],
        guild_points: [],
        messages: [],
        user: [],
        winers: [],
        entry_prize: 0,
        total_prize: BigInt(bounty.prize).toString(),
        no_of_winners: bounty.noOfWinners,
        no_of_participants: BigInt(0).toString(),
        milestone_type:MilestonesType.Single,
        end_date: bounty.endDate.toString(),
        title: bounty.title,
        points: null,
        milestones: null,

      }
      const create_bounty = await wallet.callMethod({
        contractId: BugBountyContract,
        method: "insert_bounty",
        args: {
          bounty_id: data.id_hash, value: JSON.stringify(data)
        }
      })
      // handleClearFields()
      // console.log(data)
      if (create_bounty) {
        console.log(create_bounty)
      }
    }catch(err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex ">
      <Header />
      <Sidebar />
      <div className="mt-[5rem] flex flex-col w-full mb-4 mx-4 lg:mx-8">
        <h1 className={` text-[1rem] mb-6 text-center   mt-8`}>
          {" "}
          Create a
          <span className="bg-gradient-to-r from-linear-1  to-linear-2  text-[transparent] bg-clip-text">
            {" "}
            Bug Bounty
          </span>
        </h1>
        <div className="flex mt-4 mx-4 flex-col">
          <p className="text-[0.8rem] mt-4 mb-[1rem] font-semibold sm:text-base  bg-gradient-to-r from-linear-1  to-linear-2  text-[transparent] bg-clip-text">
            Bounty Details
          </p>
          <div className="flex-col  flex mt-3">
            <p className="text-sm sm:text-[.85rem] mt-[.8rem] font-normal text-white">
              Title
            </p>
            <div className=" my-4 items-center pr-8 pl-2 h-[2rem] border-[#595959] hover:border-[#fc923b]  bg-[#141414] border-solid border rounded-[6px] flex">
              <input
                className="border-none w-full text-white pl-0 focus:outline-none placeholder:text-[0.8rem] focus:ring-0 placeholder:text-[#595959] appearance-none text-[0.9rem] bg-[#141414] py-[.1rem]"
                placeholder="Summarize bounty title"
                type="text"
                onChange={(e) => {
                  setBounty({...bounty, title:e.target.value})
                }}
                value={bounty.title}
              />
            </div>
          </div>
          <div className="">
            <>
              <div style={{ marginBottom: 16 }}>{tagChild}</div>
              {inputVisible ? (
                <ConfigProvider
                  theme={{
                    algorithm: theme.darkAlgorithm,
                    token: {
                      colorPrimary: "#fc923b",
                    },
                  }}
                >
                  <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={{ width: 78 }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                  />
                </ConfigProvider>
              ) : (
                <ConfigProvider
                  theme={{
                    algorithm: theme.darkAlgorithm,
                  }}
                >
                  <Tag onClick={showInput} style={tagPlusStyle}>
                    <PlusOutlined /> New Tag
                  </Tag>
                </ConfigProvider>
              )}
            </>
          </div>
          <div className="flex flex-row gap-8 mt-4 items-center ">
            <div className="flex flex-col w-full">
              <p className=" mb-4 text-sm sm:text-[.85rem] mt-[.8rem] font-normal text-white">
                Start Date
              </p>
              <ConfigProvider
                theme={{
                  algorithm: theme.darkAlgorithm,
                  token: {
                    colorPrimaryActive: "#fc923b",
                    colorPrimary: "#fc923b",
                    colorPrimaryHover: "#fc923b",
                    colorText: "#fff",
                  },
                }}
              >
                <DatePicker
                value={dayjs(bounty.startDate)}
                onChange={(date, dateString) => {
                  console.log(dateString)
                  if (dateString.length === 0)  {}
                  else {
                    setBounty({...bounty, 
                      startDate: new Date(dateString as string).getTime()});
                  }
                }}
                />
              </ConfigProvider>
            </div>
            <div className="flex flex-col w-full ">
              <p className=" mb-4 mt-3   text-sm sm:text-[.85rem] font-normal text-white">
                End Date
              </p>
              <ConfigProvider
                theme={{
                  algorithm: theme.darkAlgorithm,
                  token: {
                    colorPrimaryActive: "#fc923b",
                    colorPrimary: "#fc923b",
                    colorPrimaryHover: "#fc923b",
                    colorText: "#fff",
                  },
                }}
              >
                <DatePicker
                   value={dayjs(bounty.endDate)}
                   onChange={(date, dateString) => {
                     console.log(dateString)
                     if (dateString.length === 0)  {}
                     else {
                       setBounty({...bounty, 
                        endDate: new Date(dateString as string).getTime()});
                     }
                   }} 
                // onChange={onEndDateChange}
                />
              </ConfigProvider>
            </div>
          </div>
          {/* Bounty Statement */}
          <div className="flex-col flex mt-4 ">
            <p className="text-sm sm:text-[.85rem] mt-[.8rem] font-normal text-white">
              Details
            </p>
            <Editor handleContent={handleContent} content={bountyDetails} />
          </div>
          <div className="mt-8 mb-4 border border-solid border-[#2E3438] w-full" />
          <p className="text-[0.8rem] mt-4 mb-[1rem] font-semibold sm:text-base  bg-gradient-to-r from-linear-1  to-linear-2  text-[transparent] bg-clip-text">
            Funder's Details
          </p>

          <div className="flex flex-col w-full">
            <p className="text-sm sm:text-[.85rem] mt-[.8rem] mb-4 font-normal text-white">
              Sponsor
            </p>
            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                  colorPrimaryActive: "#fc923b",
                  colorPrimary: "#fc923b",
                  colorPrimaryHover: "#fc923b",
                  colorText: "#fff",
                },
              }}
            >
              <div className=" my-4 items-center pr-8 pl-2 h-[2rem] border-[#595959] hover:border-[#fc923b]  bg-[#141414] border-solid border rounded-[6px] flex">
              <input
                className="border-none w-full text-white pl-0 focus:outline-none placeholder:text-[0.8rem] focus:ring-0 placeholder:text-[#595959] appearance-none text-[0.9rem] bg-[#141414] py-[.1rem]"
                placeholder="name"
                type="text"
                onChange={(e) => {
                  setBounty({...bounty, creator:e.target.value})
                }}
                value={bounty.creator}
              />
              </div>
            </ConfigProvider>
          </div>
          <div className="flex flex-row gap-8 items-center ">
            <div className="flex flex-col w-[50%]">
              <p className="mb-4 text-sm sm:text-[.85rem] mt-[1.5rem] font-normal text-white">
                Sponsor's contact info
              </p>
              <ConfigProvider
                theme={{
                  algorithm: theme.darkAlgorithm,
                  token: {
                    colorPrimaryActive: "#fc923b",
                    colorPrimary: "#fc923b",
                    colorPrimaryHover: "#fc923b",
                    colorText: "#fff",
                  },
                }}
              >
                <Select
                  placeholder="Select a method"
                  optionFilterProp="children"
                  // onChange={handleTournamentTypeChange}
                  // filterOption={filterOption1}
                  options={[
                    {
                      value: "Email",
                      label: "Email",
                    },
                    {
                      value: "Telegram",
                      label: "Telegram",
                    },
                    {
                      value: "Discord",
                      label: "Discord",
                    },
                  ]}
                />
              </ConfigProvider>
            </div>
            <div className=" mt-[3.7rem] items-center pr-8 pl-2 h-[2rem] border-[#595959] hover:border-[#fc923b]  bg-[#141414] border-solid border w-[50%] rounded-[6px] flex">
              <input
                className="border-none w-full text-white pl-0 focus:outline-none placeholder:text-[0.8rem] focus:ring-0 placeholder:text-[#595959] appearance-none text-[0.9rem] bg-[#141414] py-[.1rem]"
                placeholder="Input contact address"
                type="text"
                // onChange={onTitleChange}
                // value={title}
              />
            </div>
          </div>
          {/* PAYMENT SECTION */}
          <div className="mt-8 mb-4 border border-solid border-[#2E3438] w-full" />
          <p className="text-[0.8rem] mt-4 mb-[1rem] font-semibold sm:text-base  bg-gradient-to-r from-linear-1  to-linear-2  text-[transparent] bg-clip-text">
            Payment Details
          </p>
          <div className="flex flex-row gap-8 items-center ">
            <div className="flex flex-col w-[50%]">
              <p className="mb-4 text-sm sm:text-[.85rem] mt-[1.5rem] font-normal text-white">
                Token for reward
              </p>
              <ConfigProvider
                theme={{
                  algorithm: theme.darkAlgorithm,
                  token: {
                    colorPrimaryActive: "#fc923b",
                    colorPrimary: "#fc923b",
                    colorPrimaryHover: "#fc923b",
                    colorText: "#fff",
                  },
                }}
              >
                <Select
                  placeholder="Payment method"
                  optionFilterProp="children"
                  // onChange={handleTournamentTypeChange}
                  // filterOption={filterOption1}
                  options={[
                    {
                      value: "NEAR",
                      label: "NEAR",
                    }
                    // {
                    //   value: "BTC",
                    //   label: "BTC",
                    // },
                    // {
                    //   value: "USDT",
                    //   label: "USDT",
                    // },
                  ]}
                />
              </ConfigProvider>
            </div>
            <div className="flex flex-col w-[50%]">
              <p className="mb-4 text-sm sm:text-[.85rem] mt-[1.5rem] font-normal text-white">
                Token Amount
              </p>
              <div className="w-full items-center pr-8 pl-2 h-[2rem] border-[#595959] hover:border-[#fc923b]  bg-[#141414] border-solid border rounded-[6px] flex">
                <input
                  min="0" 
                  className="border-none w-full text-white pl-0 focus:outline-none placeholder:text-[0.8rem] focus:ring-0 placeholder:text-[#595959] appearance-none text-[0.9rem] bg-[#141414] py-[.1rem]"
                  placeholder="Amount"
                  type="number"
                  onChange={(e) => setBounty({...bounty, prize: +e.target.value})}
                  value={bounty.prize}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-8 items-center ">
            <div className="flex flex-col w-[50%]">
              <p className=" mb-4 text-sm sm:text-[.85rem] mt-[1.5rem] font-normal text-white">
                Number of Winners
              </p>
              <ConfigProvider
                theme={{
                  algorithm: theme.darkAlgorithm,
                  token: {
                    colorPrimaryActive: "#fc923b",
                    colorPrimary: "#fc923b",
                    colorPrimaryHover: "#fc923b",
                    colorText: "#fff",
                  },
                }}
              >
                <Select
                  placeholder=" Number of Winners"
                  optionFilterProp="children"
                  onChange={(value) => setBounty({...bounty, noOfWinners:value }) }
                  // filterOption={filterOption}
                  options={[
                    {
                      value: 1,
                      label: "1",
                    },
                    {
                      value: 2,
                      label: "2",
                    },
                    {
                      value: 3,
                      label: "3",
                    },
                  ]}
                />
              </ConfigProvider>
            </div>
          </div>
        </div>

        <div className="flex justify-end w-full items-center">
          <div className=" flex justify-between items-center mt-4">
            <button disabled={loading} onClick={handleClearFields} className="disabled:cursor-not-allowed text-color-7  hover:text-[#EA4343]  py-2 px-[.9rem] text-[0.85rem] border border-solid border-[#EA4343]/40 sm:text-sm cursor-pointer hover:bg-[#211416] rounded-lg">
              Cancel
            </button>
            <button disabled={loading} onClick={createBounty} className=" disabled:bg-gray-400 disabled:text-black disabled:cursor-not-allowed ml-8 text-color-7 hover:text-[#3DB569]  py-2 px-[.9rem] text-[0.85rem] border border-solid border-[#3DB569]/40 sm:text-sm cursor-pointer hover:bg-[#111E18] rounded-lg">
              {loading? "submitting": "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBounty;
