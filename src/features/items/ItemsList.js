import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchItems, selectItemIds, selectItemById } from './itemsSlice';


const ItemExcerpt = ({ itemId }) => {
    const item = useSelector(state => selectItemById(state, itemId))

    return (
        <article className="item-excerpt" key={item._id}>
            <h3>{item.title}</h3>
        </article>
    )
}
export const ItemsList = () => {
    const dispatch = useDispatch()
    const orderedItemIds = useSelector(selectItemIds);

    const itemStatus = useSelector((state) => state.items.status)
    const error = useSelector((state) => state.items.error)

    useEffect(() => {
        if (itemStatus === 'idle') {
            dispatch(fetchItems())
        }
    }, [itemStatus, dispatch])
    
    let content

    if (itemStatus === 'loading') {
        content = <div className="loader">Loading...</div>
    } else if (itemStatus === 'succeeded') {
        content = orderedItemIds.map(itemId => (
            <ItemExcerpt key={itemId} itemId={itemId} />
        ))
        console.log(content)
    } else if (itemStatus === 'error') {
        content = <div>{error}</div>
    }

    return (
        <section className="items-list">
            <h2>Items</h2>
            {content}
        </section>
    );
}