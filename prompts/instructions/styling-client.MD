# Styling client

## Tailwind theme
We are going to use the Neobrutalism theme from https://www.neobrutalism.dev/docs. It's a clean & simple theme based on React Tailwind 3 and provides a lot of components created with Shadcn UI.

## Installation instructions
Make use of the instructions at https://www.neobrutalism.dev/docs/installation and please note that we are using React with Vite and for installing components we are going to install them via Shadcn cli.

## Styling
We are going to use CSS variables and not utility classes. This is the desired config obtained from https://www.neobrutalism.dev/docs/styling is:
1. for `index.css`:
```
@tailwind base;
@tailwind components;
@tailwind utilities;
  
:root {
  --main: #A3E636;
  --overlay: rgba(0, 0, 0, 0.8); /* background color overlay for alert dialogs, modals, etc. */

  --bg: #E0E7F1;
  --bw: #fff; /* white and secondary black e.g. utility class variant would be: bg-[#fff] dark:bg-[#212121] */
  --blank: #000; /* blank black and white */
  --border: #000;
  --text: #000;
  --mtext: #000; /* text that is placed on background with main color e.g. text color of default button */
  --ring: #000;
  --ring-offset: #fff;

  --border-radius: 4px;
  --box-shadow-x: 3px;
  --box-shadow-y: 3px;
  --reverse-box-shadow-x: -3px;
  --reverse-box-shadow-y: -3px;
  --base-font-weight: 500;
  --heading-font-weight: 700;

  --shadow: var(--box-shadow-x) var(--box-shadow-y) 0px 0px var(--border);
}

.dark {
  --bg: #2c312b;
  --bw: #212121;
  --blank: #fff;
  --border: #000;
  --text: #e6e6e6;
  --mtext: #000;
  --ring: #fff;
  --ring-offset: #000;

  --shadow: var(--box-shadow-x) var(--box-shadow-y) 0px 0px var(--border);
}
```

2. for `tailwind.config.js`:
```
theme: {
  extend: {
    colors: {
      main: 'var(--main)',
      overlay: 'var(--overlay)',
      bg: 'var(--bg)',
      bw: 'var(--bw)',
      blank: 'var(--blank)',
      text: 'var(--text)',
      mtext: 'var(--mtext)',
      border: 'var(--border)',
      ring: 'var(--ring)',
      ringOffset: 'var(--ring-offset)',
      
      secondaryBlack: '#212121', 
    },
    borderRadius: {
      base: '4px'
    },
    boxShadow: {
      shadow: 'var(--shadow)'
    },
    translate: {
      boxShadowX: '3px',
      boxShadowY: '3px',
      reverseBoxShadowX: '-3px',
      reverseBoxShadowY: '-3px',
    },
    fontWeight: {
      base: '500',
      heading: '700',
    },
  },
},
```

The font family used is DM Sans

## Components needed
Import the following components:
- Accordion: https://www.neobrutalism.dev/components/accordion
- Alert Dialog: https://www.neobrutalism.dev/components/alert-dialog
- Alert: https://www.neobrutalism.dev/components/alert
- Avatar: https://www.neobrutalism.dev/components/avatar
- Badge: https://www.neobrutalism.dev/components/badge
- Button: https://www.neobrutalism.dev/components/button
- Card: https://www.neobrutalism.dev/components/card
- Checkbox: https://www.neobrutalism.dev/components/checkbox
- Form: https://www.neobrutalism.dev/components/form
- Input: https://www.neobrutalism.dev/components/input
- Label: https://www.neobrutalism.dev/components/label
- Marquee: https://www.neobrutalism.dev/components/marquee
- Navigation Menu: https://www.neobrutalism.dev/components/navigation-menu
- Pagination: https://www.neobrutalism.dev/components/pagination
- Progress: https://www.neobrutalism.dev/components/progress
- Radio Group: https://www.neobrutalism.dev/components/radio-group
- Select: https://www.neobrutalism.dev/components/select
- Skeleton: https://www.neobrutalism.dev/components/skeleton
- Slider: https://www.neobrutalism.dev/components/slider
- Switch: https://www.neobrutalism.dev/components/switch
- Table: https://www.neobrutalism.dev/components/table
- Tabs: https://www.neobrutalism.dev/components/tabs
- Toast: https://www.neobrutalism.dev/components/toast
- Tooltip: https://www.neobrutalism.dev/components/tooltip