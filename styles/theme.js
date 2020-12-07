import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    body: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  },
  components: {
    Text: {
      baseStyle: {
        fontSize: '1.125rem',
        color: 'black',
      },
    },
    Link: {
      baseStyle: {
        fontSize: '1.125rem',
        color: '#3b82f6',
        fontWeight: '500',
        _hover: {
          textDecoration: 'none',
        },
      },
    },
    PostContent: {
      styles: {
        global: {
          p: {
            fontSize: 'sm',
            lineHeight: '1.4',
          },
        },
      }
    }
  },
})

export default theme;
