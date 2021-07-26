# Database Schema

A quick overview of the database schema used to store the items in this app. This app stores chunks of information that we call 'Items'. Each Item has two properties, an ID that is a unique identifier and a Label that is a human readable name for the item. Items can also optionally be attached to a single parent item.

This data is mildly relational, so it can be stored in a simple SQLite database for now. Depending on how the domain of the Item changes, we may need to look for more robust data storage backends.

Items:
+----+----------+-----------+
| ID |  Label   | Parent ID |
+----+----------+-----------+
|  1 | root     | null      |
|  2 | ant      | 1         |
|  3 | bear     | 1         |
|  7 | frog     | 1         |
|  4 | cat      | 3         |
|  5 | dog      | 3         |
|  6 | elephant | 5         |
+----+----------+-----------+
