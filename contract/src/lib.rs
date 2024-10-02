use crate::bounties::*;
use crate::token_transfer::*;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap, UnorderedSet};
// use near_sdk::store::{IterableMap, IterableSet, LookupMap, LookupSet, Vector};
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::BorshStorageKey;
use near_sdk::Promise;
use near_sdk::{env, log, near_bindgen, AccountId};

mod token_transfer;
mod bounties;

// const TOURNAMENT_NUMBER: u8 = 1;
// // 5 Ⓝ in yoctoNEAR
// const PRIZE_AMOUNT: U128 = near_sdk::json_types::U128(5_000_000_000_000_000_000_000_000);

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct BugBounty {
    pub beneficiary: AccountId,
    pub payments: UnorderedMap<AccountId, u128>,
    accounts: UnorderedMap<AccountId, UnorderedSet<String>>,
    users: LookupMap<AccountId, User>,
    bounties: LookupMap<String, bounties::BountyAccount>,
    guilds: LookupMap<String, bounties::Guild>,
    chats: LookupMap<String, bounties::Chat>,
    builds: LookupMap<String, bounties::BuildAccount>,
    bugs: LookupMap<String, bounties::BugAccount>,
    bounty_ids: UnorderedSet<String>,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct User {
    pub id_hash: String,
    pub age: u8,
    pub date: String,
    pub status: Status,
    pub bounties_wons: u8,
    pub bountys_created: u8,
    pub points: Option<u128>,
    pub username: String,
    pub is_mod: bool,
    pub principal_id: String,
    pub account_id: String,
    pub canister_id: String,
    pub guild_badge: String,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub enum Status {
    Online,
    Offline,
}

impl Default for BugBounty {
    fn default() -> Self {
        Self {
            beneficiary: "v1.faucet.nonofficial.testnet".parse().unwrap(),
            payments: UnorderedMap::new(b"d"),
            accounts: UnorderedMap::new(b"t"),
            bounties: LookupMap::new(b"c"),
            guilds: LookupMap::new(b"c"),
            chats: LookupMap::new(b"c"),
            builds: LookupMap::new(b"c"),
            users: LookupMap::new(b"c"),
            bounty_ids: UnorderedSet::new(b"u"),
            bugs: LookupMap::new(b"c"),
        }
    }
}

#[near_bindgen]
impl BugBounty {
    #[init]
    pub fn new() -> Self {
        Self {
            beneficiary: "v1.faucet.nonofficial.testnet".parse().unwrap(),
            payments: UnorderedMap::new(b"d"),
            accounts: UnorderedMap::new(b"t"),
            bounties: LookupMap::new(b"c"),
            guilds: LookupMap::new(b"c"),
            chats: LookupMap::new(b"c"),
            builds: LookupMap::new(b"c"),
            users: LookupMap::new(b"c"),
            bounty_ids: UnorderedSet::new(b"u"),
            bugs: LookupMap::new(b"c"),
        }
    }

    // Public - beneficiary getter
    pub fn get_beneficiary(&self) -> AccountId {
        self.beneficiary.clone()
    }

    pub fn create_user(&mut self, account_id: AccountId, user: User) {
        self.users.insert(&account_id, &user);
    }

    pub fn remove_user(&mut self, account_id: AccountId) {
        self.users.remove(&account_id);
    }

    pub fn get_user(&self, account_id: AccountId) -> Option<User> {
        self.users.get(&account_id)
    }

    pub fn is_user_present(&self, account_id: AccountId) -> bool {
        self.users.contains_key(&account_id)
    }

    // Public - but only callable by env::current_account_id(). Sets the beneficiary
    #[private]
    pub fn change_beneficiary(&mut self, beneficiary: AccountId) {
        self.beneficiary = beneficiary;
    }

    // pub fn get_all_users(&self) -> LookupMap<AccountId, User> {
    //     self.users.clone()
    // }
}
