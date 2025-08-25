# Next.js & HeroUI Template

This is a template for creating applications using Next.js 14 (app directory) and HeroUI (v2).

[Try it on CodeSandbox](https://codesandbox.io/p/github/rironib/herouiauth)

## Technologies Used

- [Next.js v15](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [TailwindCSS v4](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Clone the repository

Clone the repository using the command below:

```bash
git clone https://github.com/rironib/herouiauth.git
```

### Install dependencies

```bash
pnpm install
```

### Run the development server

```bash
pnpm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).
