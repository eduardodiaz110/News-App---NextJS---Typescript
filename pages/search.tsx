import NewsArticlesGrid from "@/components/NewsArticlesGrid";
import { NewsArticle } from "@/models/NewsArticles";
import Head from "next/head";
import { FormEvent,useState } from "react";
import {Spinner,Form,Button} from "react-bootstrap";
import {Alert} from "react-bootstrap";


const SearchNewsPage = () => {

    const [searchResults, setSearchResults] = useState<NewsArticle[] | null>(null);

    const [searchResultsLoading, setSearchResultsLoading] = useState(false);
    const [searchResultsLoadingisError, setSearchResultsLoadingisError] = useState(false);


    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const searchQuery = formData.get("searchQuery")?.toString().trim();

        if (searchQuery){
            try{
                setSearchResults(null);
                setSearchResultsLoadingisError(false);
                setSearchResultsLoading(true);
                const response = await fetch(`/api/search-news?q=` + searchQuery);
                const articles: NewsArticle[] = await response.json();
                setSearchResults(articles);


            }
        catch(error){
            console.error(error);
            setSearchResultsLoadingisError(true);
        } finally{
            setSearchResultsLoading(false);
        }
        
    }
}

    return ( 

        <>
        <Head>
            <title key="title">Search News - Next JS App News</title>
        </Head>
        <main>
            <h1>Search News</h1>
            <Alert className="mb-5"> This page uses <strong>client-side data fetching</strong> to show fresh data for every search. Requests are handled by our backend via <strong>API Routes</strong>.</Alert>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="search-input">
                    <Form.Label> Search query</Form.Label>
                    <Form.Control
                    name="searchQuery"
                    placeholder="E.g. politics, sports, etc."
                    />
                </Form.Group>
                <Button type="submit" className="mb-3" disabled={searchResultsLoading} >
                    Search
                </Button>
            </Form>
            <div className="d-flex flex-column align-items-center">
                {searchResultsLoading && <Spinner animation="border"/>}
                {searchResultsLoadingisError && <p>Somenthin went wrong</p>}
                {searchResults?.length === 0 && <p>Nothing found. Try a different query.</p>}
                {searchResults && <NewsArticlesGrid articles={searchResults}/>}

            </div>
        </main>

        </>
     )
}
 
export default SearchNewsPage;