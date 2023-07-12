FROM denoland/deno:ubuntu-1.22.0

WORKDIR /app

COPY . .

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "mod.ts"]

EXPOSE 9000