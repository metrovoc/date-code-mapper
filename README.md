# Date Code Mapper

Date Code Mapper converts a month-and-day value in `MMDD` format into a compact,
reversible three-digit code. It runs entirely in the browser and stores history
only in local storage.

The mapping covers all 366 possible dates by using an affine permutation of the
day of year. No date information is sent to a server.

