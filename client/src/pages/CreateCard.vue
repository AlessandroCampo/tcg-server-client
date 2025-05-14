<template>
    <div class="max-w-2xl mx-auto p-6 bg-gray-700 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-center mb-6">Create a New Card</h2>

        <form @submit.prevent="submitForm">
            <!-- Card Name -->

            <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-white">Card Name</label>
                <input id="name" v-model="form.name" type="text" placeholder="Enter card name" required
                    class="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full" />
            </div>

            <!-- Card Type -->
            <div class="mb-4">
                <label for="type" class="block text-sm font-medium text-white">Card Type</label>
                <select v-model="form.type" id="type" class="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full">
                    <option value="MINION">Minion</option>
                    <option value="SPELL">Spell</option>
                    <option value="TRAP">Trap</option>
                </select>
            </div>

            <!-- Card Color -->
            <div class="mb-4">
                <label for="color" class="block text-sm font-medium text-white">Card Color</label>
                <select v-model="form.color" id="color" class="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full">
                    <option value="WHITE">White</option>
                    <option value="RED">Red</option>
                    <option value="BLUE">Blue</option>
                    <option value="BLACK">Black</option>
                    <option value="GREEN">Green</option>
                    <option value="YELLOW">Yellow</option>
                    <option value="BROWN">Brown</option>
                </select>
            </div>

            <!-- Card Subtype -->
            <div class="mb-4" v-show="form.type != 'MINION'">
                <label for="subtype" class="block text-sm font-medium text-white">Subtype (optional)</label>
                <select v-model="form.subtype" id="subtype"
                    class="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full">
                    <option value="">None</option>
                    <option value="CONTINOUS">Continuous</option>
                    <option value="EQUIP">Equip</option>
                </select>
            </div>


            <!-- Card Cost -->
            <div class="mb-4">
                <label for="cost" class="block text-sm font-medium text-white">Cost</label>
                <input id="cost" v-model="form.cost" type="number" placeholder="Enter card cost" required
                    class="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full" />
            </div>
            <!-- Card Attack -->

            <div v-show="form.type == 'MINION'">
                <div class="mb-4">
                    <label for="attack" class="block text-sm font-medium text-white">Attack</label>
                    <input id="attack" v-model="form.attack" type="number" placeholder="Enter attack points"
                        :disabled="form.type !== 'MINION'"
                        class="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full" />
                </div>

                <!-- Card Defense -->
                <div class="mb-4">
                    <label for="defense" class="block text-sm font-medium text-white">Defense</label>
                    <input id="defense" v-model="form.defense" type="number" placeholder="Enter defense points"
                        :disabled="form.type !== 'MINION'"
                        class="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full" />
                </div>


            </div>



            <!-- Image URL -->
            <div class="mb-4">
                <label for="image" class="block text-sm font-medium text-white">Card Image (JPG)</label>
                <input id="image" ref="fileInput" type="file" accept="image/jpeg" @change="onFileChange" required
                    class="mt-1 w-full" />
                <p v-if="fileError" class="text-red-500 text-sm mt-1">{{ fileError }}</p>
            </div>

            <!-- Rarity (select dropdown) -->
            <div class="mb-4">
                <label for="rarity" class="block text-sm font-medium text-white">Rarity</label>
                <select v-model="form.rarity" id="rarity"
                    class="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full">
                    <option value="COMMON">Common</option>
                    <option value="UNCOMMON">Uncommon</option>
                    <option value="RARE">Rare</option>
                    <option value="EPIC">Epic</option>
                    <option value="LEGENDARY">Legendary</option>
                </select>
            </div>

            <!-- Choose or Create Effects -->
            <!-- Effect Name -->
            <div class="mb-4">
                <label for="effectName" class="block text-sm font-medium text-white">Effect Name</label>
                <input id="effectName" v-model="form.effectName" type="text" placeholder="Optional effect name"
                    class="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full" />
            </div>

            <!-- Effect Text -->
            <div class="mb-4">
                <label for="cardText" class="block text-sm font-medium text-white">Card Text</label>
                <textarea id="cardText" v-model="form.effectText" placeholder="Card effect or description" rows="4"
                    class="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"></textarea>
            </div>


            <!-- Choose or Create Keywords -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-white">Keywords</label>
                <div class="flex flex-col space-y-2">
                    <div v-for="keyword in keywords" :key="keyword.id" class="flex items-center">
                        <input type="checkbox" :id="`keyword-${keyword.id}`" v-model="form.keywordIds"
                            :value="keyword.id" class="mr-2" />
                        <label :for="`keyword-${keyword.id}`" class="text-sm">{{ keyword.name }}</label>
                    </div>
                </div>
                <button type="button" @click="showKeywordModal = true" class="text-blue-600 hover:underline mt-2">
                    Create New Keyword
                </button>
            </div>

            <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                Create Card
            </button>
        </form>



        <!-- Keyword Modal -->
        <div v-if="showKeywordModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 class="text-lg font-semibold mb-4">Create a New Keyword</h3>

                <div class="mb-4">
                    <label for="keywordName" class="block text-sm font-medium text-white">Keyword Name</label>
                    <input id="keywordName" v-model="newKeyword.name" type="text" placeholder="Enter keyword name"
                        class="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full" />
                </div>

                <div class="flex justify-between">
                    <button type="button" @click="createKeyword"
                        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                        Create Keyword
                    </button>
                    <button type="button" @click="showKeywordModal = false"
                        class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';
import { BACKEND_URL } from '@/composables/useSocket';

//const URL = 'https://d075-79-18-224-70.ngrok-free.app'

const URL = BACKEND_URL;




type Keyword = {
    id?: number
    name: string
}

// Reactive state

const keywords = ref<Keyword[]>([])

const newKeyword = ref<Keyword>({ name: '' })

const showKeywordModal = ref(false)

// Main form state
const form = ref<{
    name: string;
    attack: number | null;
    defense: number | null;
    cost: number;
    type: 'MINION' | 'SPELL' | 'OTHER';
    color: 'WHITE' | 'RED' | 'BLUE' | 'BLACK' | 'GREEN';
    subtype: string;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
    effectName: string;
    effectText: string;
    keywordIds: number[];
}>({
    name: '',
    attack: 0,
    defense: 0,
    cost: 0,
    type: 'MINION',
    color: 'WHITE',
    subtype: '',
    rarity: 'COMMON',
    effectName: '',
    effectText: '',
    keywordIds: [],
});


// File upload state
const fileError = ref('')
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function onFileChange(e: Event) {
    fileError.value = ''
    const files = (e.target as HTMLInputElement).files
    if (!files || files.length === 0) {
        selectedFile.value = null
        return
    }
    const file = files[0]
    if (file.type !== 'image/jpeg') {
        fileError.value = 'Only JPG files are allowed.'
        selectedFile.value = null
        if (fileInput.value) fileInput.value.value = ''
        return
    }
    selectedFile.value = file
}
// Fetch effects & keywords
onMounted(async () => {
    try {
        const [keywordsRes] = await Promise.all([
            axios.get(`${URL}/keywords`)
        ])

        keywords.value = keywordsRes.data
    } catch (err) {
        console.error('Failed to fetch initial data:', err)
    }
})

// Create effect


// Create keyword
const createKeyword = async () => {
    if (!newKeyword.value.name) return
    try {
        const { data } = await axios.post(`${URL}/keywords`, {
            name: newKeyword.value.name
        })
        keywords.value.push(data)
        form.value.keywordIds.push(data.id)
        newKeyword.value = { name: '' }
        showKeywordModal.value = false
    } catch (err) {
        console.error('Failed to create keyword:', err)
    }
}

// Enable submit only when name and file are present
const canSubmit = computed(() => {
    return form.value.name.trim() !== '' && selectedFile.value !== null
})

// Submit form
const submitForm = async () => {
    if (!canSubmit.value) return

    if (form.value.type != 'MINION') {
        form.value.attack = null;
        form.value.defense = null;
    }

    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('attack', String(form.value.attack))
    formData.append('defense', String(form.value.defense))
    formData.append('cost', String(form.value.cost))
    formData.append('rarity', form.value.rarity)
    formData.append('type', form.value.type)
    formData.append('color', form.value.color)
    if (form.value.subtype) formData.append('subtype', form.value.subtype)
    formData.append('effectName', form.value.effectName)
    formData.append('effectText', form.value.effectText)

    form.value.keywordIds.forEach(id => formData.append('keywordIds', String(id)))


    try {
        const { data } = await axios.post(`${URL}/create-card`, formData, {
            headers: { 'Content-Type': 'application/json' }
        })

        if (data) {


            const imageUploadData = new FormData();
            imageUploadData.append('image', selectedFile.value as File)
            const res = await axios.post(`${URL}/upload-image/${data.id}`, imageUploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        }
        console.log('Card created:', data)
        window.alert(form.value.name + ' created correctly!');

        // Reset
        form.value = {
            name: '',
            attack: 0,
            defense: 0,
            cost: 0,
            rarity: 'COMMON',
            type: 'MINION',
            keywordIds: [],
            color: 'WHITE',
            effectName: '',
            effectText: '',
            subtype: '',
        }
        selectedFile.value = null
        if (fileInput.value) fileInput.value.value = ''
    } catch (err: any) {
        console.error('Submit error:', err)
        window.alert(err.response?.data?.error || 'Something went wrong')
    }
}
</script>
