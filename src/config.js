/**
 * Default configuration
 * @typ {Object}
 */
export const defaultConfig = {
    sortable: true,
    searchable: true,

    // Pagination
    paging: true,
    perPage: 10,
    perPageSelect: [5, 10, 15, 20, 25],
    colSelect: ['hello', 'world'],
    nextPrev: true,
    firstLast: false,
    prevText: "&lsaquo;",
    nextText: "&rsaquo;",
    firstText: "&laquo;",
    lastText: "&raquo;",
    ellipsisText: "&hellip;",
    ascText: "▴",
    descText: "▾",
    truncatePager: true,
    pagerDelta: 2,

    scrollY: "",

    fixedColumns: true,
    fixedHeight: false,

    header: true,
    hiddenHeader: false,
    footer: false,

    // Customise the display text
    labels: {
        placeholder: "Search...", // The search input placeholder
        perPage: "{pageselect} entries per page", // per-page dropdown label
        colSelect: "Search from {colselect} column", //column selector to search
        noRows: "No entries found", // Message shown when there are no search results
        info: "Showing {start} to {end} of {rows} entries" //
    },

    // Customise the layout
    layout: {
        top: "{pageselect}{colselect}{search}",
        bottom: "{info}{pager}"
    }
}
