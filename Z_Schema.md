# ExpenseTurkey - System Documentation

## 1. Informal Requirements

The Expense Tracker is a multi-user web application designed to help individuals manage their financial activities. The system must fulfill the following informal requirements:

- **User Authentication**: The system shall allow users to register an account and log in securely.
- **Data Isolation**: Each user must only be able to view, create, and delete their own transactions and categories.
- **Transaction Management**: Users can record transactions by specifying the amount, date, category, and an optional remark.
- **Category Management**: Users can organize their expenses into categories. Every new user is provided with a default set of 10 categories.
- **Balance Tracking**: The system must automatically calculate the running balance for each user based on their cash-in and cash-out activities.
- **Persistence**: All data must be stored securely in a database and persist across sessions.

---

## 2. Z-Schema Specification

This section provides a formal specification of the Expense Tracker using Z notation.

### 2.1 Basic Types
We define the basic sets used in our system:
- `[USER]` - The set of all possible users.
- `[ID]` - The set of all unique transaction identifiers.
- `[CATEGORY_NAME]` - The set of all category names.
- `[DATE]` - The set of all possible dates.
- `[REMARK]` - The set of all possible remarks.
- `[AMOUNT]` - The set of real numbers representing currency (ℝ).

### 2.2 State Schema: ExpenseTracker
This schema defines the system state and its invariants.

| **ExpenseTracker** |
| :--- |
| `registeredUsers : ℙ USER` |
| `transactions : ID ⇸ (USER × DATE × CATEGORY_NAME × AMOUNT × REMARK)` |
| `userCategories : USER ⇸ ℙ CATEGORY_NAME` |
| **Invariants:** |
| `dom transactions ⊆ ID` |
| `∀ t ∈ dom transactions ∙ (first(transactions(t))) ∈ registeredUsers` |
| `∀ u ∈ registeredUsers ∙ u ∈ dom userCategories` |
| `∀ t ∈ dom transactions ∙ (third(transactions(t))) ∈ userCategories(first(transactions(t)))` |

---

### 2.3 Initialization Schema
Defines the initial state of the system.

| **InitExpenseTracker** |
| :--- |
| `ExpenseTracker'` |
| `registeredUsers' = ∅` |
| `transactions' = ∅` |
| `userCategories' = ∅` |

---

### 2.4 Operation Schemas

#### Operation: RegisterUser
Allows a new user to join the system and initializes their categories.

| **RegisterUser** |
| :--- |
| `Δ ExpenseTracker` |
| `user? : USER` |
| `defaultCats? : ℙ CATEGORY_NAME` |
| `user? ∉ registeredUsers` |
| `registeredUsers' = registeredUsers ∪ {user?}` |
| `userCategories' = userCategories ⊕ {user? ↦ defaultCats?}` |
| `transactions' = transactions` |

#### Operation: AddTransaction
Adds a new transaction for an authenticated user.

| **AddTransaction** |
| :--- |
| `Δ ExpenseTracker` |
| `user? : USER` |
| `id? : ID` |
| `d? : DATE` |
| `cat? : CATEGORY_NAME` |
| `amt? : AMOUNT` |
| `rem? : REMARK` |
| `user? ∈ registeredUsers` |
| `id? ∉ dom transactions` |
| `cat? ∈ userCategories(user?)` |
| `transactions' = transactions ∪ {id? ↦ (user?, d?, cat?, amt?, rem?)}` |
| `registeredUsers' = registeredUsers` |
| `userCategories' = userCategories` |

#### Operation: DeleteTransaction
Removes a specific transaction.

| **DeleteTransaction** |
| :--- |
| `Δ ExpenseTracker` |
| `user? : USER` |
| `id? : ID` |
| `id? ∈ dom transactions` |
| `first(transactions(id?)) = user?` |
| `transactions' = {id?} ⩤ transactions` |
| `registeredUsers' = registeredUsers` |
| `userCategories' = userCategories` |

#### Operation: GetUserBalance (Query)
Calculates the current balance for a user (State does not change).

| **GetUserBalance** |
| :--- |
| `Ξ ExpenseTracker` |
| `user? : USER` |
| `balance! : AMOUNT` |
| `user? ∈ registeredUsers` |
| `balance! = ∑ { amt | ∃ i, d, c, r ∙ (transactions(i) = (user?, d, c, amt, r)) }` |

---
