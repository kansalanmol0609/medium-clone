**Deploy Link** - https://medium-clone-jet-phi.vercel.app/

**Steps for running this project on your local machine -**
1. Run ``` yarn install ``` in `root` and `/medium-clone` folder.
2. Create `.env.local` file in `root` folder and add these 3 variables -
    - NEXT_PUBLIC_SANITY_DATASET=production (from `sanity.json` file)
    - NEXT_PUBLIC_SANITY_PROJECT_ID=rbr20nbc (from `sanity.json` file)
    - SANITY_API_TOKEN = (generate this by signing up on sanity.io)
3. Install sanity-cli globally - `npm install -g @sanity/cli`
4. Run `sanity start` in `/medium-clone` folder.
5. Run `yarn run dev` in `root` folder.

**Languages And Tools Used** -
- React
- TypeScript 
- Next.js
- Tailwind CSS
- Sanity.io CMS
