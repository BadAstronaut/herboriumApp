<script lang="ts">
    //import {Herb} from '$lib/herbObject';
    import { writable } from "svelte/store";
    // @ts-ignore
    import { herbStore } from "/src/stores/herbStore.ts";
    import { onMount } from "svelte";
    import {
        createSvelteTable,
        flexRender,
        getCoreRowModel,
    } from "@tanstack/svelte-table";
    import type {
        ColumnDef,
        TableOptions,
    } from "@tanstack/table-core/src/types";
    import type { SvelteComponent } from "svelte";
    //import type { SvelteComponentTyped } from 'svelte';
    //subscribes to the herbStore
    let herbs: any;
    let table: any;

    //implement on mount
    onMount(async () => {
        herbStore.subscribe((value: any) => {
            herbs = value;
            //console.log(herbs,'herbs');
        });

        const options = writable<TableOptions<Herb>>({
            data: herbs.herbs,
            columns: defaultColumns,
            getCoreRowModel: getCoreRowModel(),
            enableRowSelection: true, //enable row selection for all rows
            // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
            onRowSelectionChange: setRowSelection,
            debugTable: true,
        });
        table = createSvelteTable(options);
    });

    let selectedRow = null;

    type Herb = {
        herb_name: string;
        planted_date: string;
        planned_harvest_date: string;
    };

    // const defaultHerbs: Herb[] = [
    //     { name: "Basil", price: 1.99, stock: 10 },
    //     { name: "Chives", price: 2.99, stock: 5 },
    //     { name: "Cilantro", price: 3.99, stock: 0 },
    //     { name: "Dill", price: 4.99, stock: 2 },
    //     { name: "Lavender", price: 5.99, stock: 8 },
    //     { name: "Mint", price: 6.99, stock: 3 },
    //     { name: "Oregano", price: 7.99, stock: 7 },
    //     { name: "Parsley", price: 8.99, stock: 1 },
    //     { name: "Rosemary", price: 9.99, stock: 4 },
    //     { name: "Sage", price: 10.99, stock: 6 },
    // ];

    const defaultColumns: ColumnDef<Herb>[] = [
        {
            accessorKey: "herb_name",
            cell: (info) => info.getValue(),
            header:"Herb Name"
            //footer: info => info.column.id,
        },
        {
            accessorKey: "planted_date",
            cell: (info) => info.getValue(),
            header:"Planted Date"
            //footer: info => info.column.id,
        },
        {
            accessorKey: "planned_harvest_date",
            cell: (info) => info.getValue(),
            header:"Planned Harvest Date"
            //footer: info => info.column.id,
        },
    ];

    function setRowSelection(row: any) {
        selectedRow = row;
        console.log(row, "row selection changed");
    }

    // const rerender = () => {
    //     options.update((options) => ({
    //         ...options,
    //         data: herbs,
    //     }));
    // };
</script>

{#if herbs}
    <table>
        <thead>
            {#each $table.getHeaderGroups() as headerGroup}
                <tr>
                    {#each headerGroup.headers as header}
                        <th>
                            {#if !header.isPlaceholder}
                                <!-- fix the typescript syntax error below -->
                                
                                <svelte:component
                                    this={flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                />
                            {/if}
                        </th>
                    {/each}
                </tr>
            {/each}
        </thead>
        <tbody>
            {#each $table.getRowModel().rows as row}
                <tr
                    data-row-id={row.id}
                    class:selected={selectedRow === row}
                    on:click={() => setRowSelection(row)}
                >
                    {#each row.getVisibleCells() as cell}
                        <td>
                            <svelte:component
                                this={flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            />
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
        <tfoot>
            {#each $table.getFooterGroups() as footerGroup}
                <tr>
                    {#each footerGroup.headers as header}
                        <th>
                            {#if !header.isPlaceholder}
                                <svelte:component
                                    this={flexRender(
                                        header.column.columnDef.footer,
                                        header.getContext()
                                    )}
                                />
                            {/if}
                        </th>
                    {/each}
                </tr>
            {/each}
        </tfoot>
    </table>
{:else}
    <h1>Grow Log</h1>
{/if}

<style>
    table {
        border-collapse: collapse;
        width: 100%;
        margin: 03;
    }
    .selected {
        background-color: lightgoldenrodyellow;
    }
    tr:hover {
        cursor: pointer;
    }
</style>
