use crate::tournaments::*;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::Promise;
use near_sdk::{env, log, near_bindgen, AccountId};

mod crowd_funded_bounties;
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
    bounties: LookupMap<String, Tournament>,
    bounty_ids: UnorderedSet<String>,
    crowd_funded_bounties: LookupMap<String, Tournament>,
    crowd_funded_bounties_ids: UnorderedSet<String>,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct User {
    user_id: AccountId,
    age: u8,
    status: Status,
    // ⟵ Another struct we've defined
    wins: u8,
    username: String,
}

impl Default for BugBounty {
    fn default() -> Self {
        Self {
            beneficiary: "v1.faucet.nonofficial.testnet".parse().unwrap(),
            payments: UnorderedMap::new(b"d"),
            accounts: UnorderedMap::new(b"t"),
            bounties: LookupMap::new(b"c"),
            users: LookupMap::new(b"c"),
            bounty_ids: UnorderedSet::new(b"u"),
            crowd_funded_bounties: LookupMap::new(b"c"),
            crowd_funded_bounties_ids: UnorderedSet::new(b"u"),
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
            users: LookupMap::new(b"c"),
            bounty_ids: UnorderedSet::new(b"u"),
            crowd_funded_bounties: LookupMap::new(b"c"),
            crowd_funded_bounties_ids: UnorderedSet::new(b"u"),
        }
    }

    // Public - beneficiary getter
    pub fn get_beneficiary(&self) -> AccountId {
        self.beneficiary.clone()
    }

    // Public - but only callable by env::current_account_id(). Sets the beneficiary
    #[private]
    pub fn change_beneficiary(&mut self, beneficiary: AccountId) {
        self.beneficiary = beneficiary;
    }

    // pub fn get_all_users(&mut self) -> User {
    //     let mut users = &self
    //         .users;
    //     users;
    // }

    pub fn get_user(&mut self, owner_id: AccountId) -> User {
        let user = self
            .users
            .get(&owner_id)
            .unwrap_or_else(|| env::panic_str("ERR_INCORRECT_USERID"));
        return user;
    }
}
