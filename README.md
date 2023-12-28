## Without Docker

### Run yarn to install dependencies

```bash
yarn
```

### Start the server

```bash
yarn run dev
```

### Format the code

```bash
yarn prettier --write "src/**/*.ts"
```

## With Docker

### Build Container

```bash
docker build -t tasking .
```

hello

### Build Container

```bash
docker run -p 3001:3001 -d tasking
```
