# Getir Nodejs Case Study




## Installation

If you are not a tester, do not clone this repository. Server demo is up on https://getir-project-ataberk-gozkaya.herokuapp.com/.


1. Install npm packages:

```bash
npm install
```

2. To run app just call following in your command line:

```bash
npm start
```

3. To run tests :

```bash
npm run test
```

#### Filter Records

```http
  POST /records
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `startDate` | `String` | `Date(YYYY-MM-DD) format` |
  `endDate` | `String`|`Date(YYYY-MM-DD) format`
  `minCount`|`Number`| `Minimum count wanted for filtering`
  `maxCount`|`Number`| `Maximum number wanted for filtering`


### Get Records based on Query

Method: `POST`

Body:

```json
{
  "startDate": "2013-10-01", 
  "endDate": "2020-12-01", 
  "minCount": 1000, 
  "maxCount": 3000 
}
```

**Response**

Status: `200`

```json
{
  "code": 0,
    "msg": "Success",
    "records": [
    {
         "key": "GjhjVIKb",
         "createdAt": "2015-12-11T21:05:51.775Z",
         "totalCount": 2737
    },
    ...
  ]
}
```
